/**
 *
 * @module Mailer
 */

import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import {
    ENVIRONMENT,
    LIVE_MAIL_PASSWORD,
    LIVE_MAIL_USER,
    TEST_MAIL_HOST,
    TEST_MAIL_PASSWORD,
    TEST_MAIL_PORT,
    TEST_MAIL_USER
} from "../config.js";

/**
 * Creates a nodemailer transporter for Gmail
 * @type {Mail}
 */
const transporterLive = nodemailer.createTransport(smtpTransport({

    service: 'gmail',
    auth: {
        user: LIVE_MAIL_USER,
        pass: LIVE_MAIL_PASSWORD
    }
}));


/**
 * Creates a nodemailer transporter
 * @type {Mail}
 */
const transporterTest = nodemailer.createTransport(smtpTransport({
    host: TEST_MAIL_HOST,
    port: TEST_MAIL_PORT,
    auth: {
        user: TEST_MAIL_USER,
        pass: TEST_MAIL_PASSWORD
    }
}));


/**
 * Sends an email using the transporter
 * @param {Object} options - {from: string, to: string, subject: string, text: string, html: string}
 * @return {Promise<void>}
 */
async function sendEmail(options) {
    try {
        if (ENVIRONMENT !== "production") {
            await transporterTest.sendMail(options)
                .catch((error) => {
                    console.error('Error sending email:', error);
                    throw error;
                });
        } else {
            await transporterLive.sendMail(options)
                .catch((error) => {
                    console.error('Error sending email:', error);
                    throw error;
                });
        }
    } catch (error) {
        console.error('Error sending email:', error);
    }
}


export {sendEmail}