const baseUrl = "https://musicrecorddr-aybub4ede4hmdgcf.polandcentral-01.azurewebsites.net/api/MusicRecord";
const authUrl = "https://musicrecorddr-aybub4ede4hmdgcf.polandcentral-01.azurewebsites.net/api/Auth/login";

Vue.createApp({
    data() {
        return {
            records: [],
            hasSearched: false,

            artistToGetBy: "",
            idToGetBy: null,
            singleRecord: null,

            deleteId: null,
            deleteMessage: "",

            addData: {
                title: "",
                artist: "",
                duration: null,
                publicationYear: null
            },
            addMessage: "",

            updateData: {
                id: null,
                title: "",
                artist: "",
                duration: null,
                publicationYear: null
            },
            updateMessage: "",

            // Login data
            loginData: {
                username: "",
                password: ""
            },

            loginMessage: "",
            token: null,
            isLoggedIn: false
        };
    },

    mounted() {
        // Checks if token already exists in localStorage
        const savedToken = localStorage.getItem("token");

        if (savedToken) {
            this.token = savedToken;
            this.isLoggedIn = true;
        }
    },

    methods: {

        // ================= LOGIN =================
        async login() {
            this.loginMessage = "";

            try {
                const response = await axios.post(authUrl, this.loginData);

                this.token = response.data.token;
                localStorage.setItem("token", this.token);

                this.isLoggedIn = true;
                this.loginMessage = "Login successful";
            }
            catch (ex) {
                this.loginMessage = "Login failed";
                alert(ex.response?.data || ex.message);
            }
        },

        logout() {
            this.token = null;
            this.isLoggedIn = false;
            this.loginMessage = "";

            localStorage.removeItem("token");
        },

        // ================= AUTH HEADER =================
        getAuthHeader() {
            return {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            };
        },

        // ================= GET ALL =================
        async getAllRecords() {
            await this.getRecords(baseUrl);
        },

        async getByArtist(artist) {
            const url = baseUrl + "?artist=" + encodeURIComponent(artist);
            await this.getRecords(url);
        },

        async getRecords(url) {
            this.singleRecord = null;
            this.deleteMessage = "";
            this.addMessage = "";
            this.updateMessage = "";

            try {
                const response = await axios.get(url);

                this.records = response.data;
                this.hasSearched = true;
            }
            catch (ex) {
                this.records = [];
                this.hasSearched = true;

                alert(ex.response?.data || ex.message);
            }
        },

        // ================= GET BY ID =================
        async getById(id) {
            this.singleRecord = null;

            if (id == null || id <= 0) {
                alert("Id skal være større end 0.");
                return;
            }

            try {
                const response = await axios.get(baseUrl + "/" + id);
                this.singleRecord = response.data;
            }
            catch (ex) {
                this.singleRecord = null;
                alert(ex.response?.data || ex.message);
            }
        },

        // ================= DELETE =================
        async deleteRecord(id) {
            this.deleteMessage = "";

            if (id == null || id <= 0) {
                alert("Id skal være større end 0.");
                return;
            }

            try {
                const response = await axios.delete(
                    baseUrl + "/" + id,
                    this.getAuthHeader()
                );

                this.deleteMessage = response.status + " " + response.statusText;

                await this.getAllRecords();
            }
            catch (ex) {
                alert(ex.response?.data || ex.message);
            }
        },

        // ================= ADD =================
        async addRecord() {
            this.addMessage = "";

            try {
                const response = await axios.post(
                    baseUrl,
                    this.addData,
                    this.getAuthHeader()
                );

                this.addMessage = response.status + " " + response.statusText;

                this.addData = {
                    title: "",
                    artist: "",
                    duration: null,
                    publicationYear: null
                };

                await this.getAllRecords();
            }
            catch (ex) {
                alert(ex.response?.data || ex.message);
            }
        },

        // ================= UPDATE =================
        async updateRecord() {
            this.updateMessage = "";

            if (this.updateData.id == null || this.updateData.id <= 0) {
                alert("Id skal være større end 0.");
                return;
            }

            try {
                const response = await axios.put(
                    baseUrl + "/" + this.updateData.id,
                    this.updateData,
                    this.getAuthHeader()
                );

                this.updateMessage = response.status + " " + response.statusText;

                this.updateData = {
                    id: null,
                    title: "",
                    artist: "",
                    duration: null,
                    publicationYear: null
                };

                await this.getAllRecords();
            }
            catch (ex) {
                alert(ex.response?.data || ex.message);
            }
        }
    }

}).mount("#app");