import {faker} from "@faker-js/faker";
import axios from "axios";
import {expect} from "chai";
import {connectToTestDatabase} from "../../src/models/database.js";
import {AdminModel, getAdminByEmail} from "../../src/models/admins.js";

describe("Admin Authentication", () => {
    before((done) => {
        connectToTestDatabase().then(() => done());
    });

    const fullName = faker.person.fullName();
    const email = faker.internet.email();
    const password = faker.string.alphanumeric();
    describe("Register Admin", async () => {

        it("Should create a new admin", async () => {
            const options = {
                method: 'POST',
                url: 'http://testserver.com:8080/admin/register',
                headers: {'Content-Type': 'application/json'},
                data: {
                    fullname: fullName,
                    email: email,
                    password: password
                }
            };
            const data = await axios.request(options);
            expect(data.request.res.statusCode).to.equal(201);
        });

        it("Should return status code 400 because of missing fields", async () => {
            const options = {
                method: 'POST',
                url: 'http://testserver.com:8080/admin/register',
                headers: {'Content-Type': 'application/json'},
                data: {
                    fullname: fullName,
                    email: email
                }
            };
            await axios.request(options).catch((error) => {
                    expect(error.response.request.res.statusCode).to.equal(400);
                }
            );
        });

        it("Should verify otp", async () => {
            const admin = await getAdminByEmail(email);
            const otp = admin.authentication.otp.code;
            const options = {
                method: 'POST',
                url: 'http://testserver.com:8080/admin/otp/verify',
                headers: {'Content-Type': 'application/json'},
                data: {
                    email: email,
                    otp: otp
                }
            };
            const axiosResponse = await axios.request(options);
            expect(axiosResponse.status).to.equal(200);
            expect(axiosResponse.data.data.emailVerified).to.equal(true);
        });

        it("Should request new otp", async () => {
            const options = {
                method: 'POST',
                url: 'http://testserver.com:8080/admin/otp/new',
                headers: {'Content-Type': 'application/json'},
                data: {
                    email: email,
                }
            };
            const axiosResponse = await axios.request(options);
            expect(axiosResponse.status).to.equal(200);
        });
    });

    describe("Login in as Admin", async () => {
        it("Should login with email and password", async () => {
            const admin = await getAdminByEmail(email);
            const otp = admin.authentication.otp.code;
            const options = {
                method: 'POST',
                url: 'http://testserver.com:8080/admin/login',
                headers: {'Content-Type': 'application/json'},
                data: {
                    email: email,
                    password: password
                }
            };
            const axiosResponse = await axios.request(options);
            expect(axiosResponse.status).to.equal(200);
        });
    });
})