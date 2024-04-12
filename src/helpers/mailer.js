/**
 *
 * @module Mailer
 */

import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import {MAIL_HOST, MAIL_PASSWORD, MAIL_PORT, MAIL_USER} from "../config.js";

/**
 * Creates a nodemailer transporter
 * @type {Mail}
 */
const transporter = nodemailer.createTransport(
    smtpTransport({
        host: MAIL_HOST,
        port: MAIL_PORT,
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASSWORD
        }
    }),
);

/**
 * Sends an email using the transporter
 * @param {Object} options - {from: string, to: string, subject: string, text: string, html: string}
 * @return {Promise<void>}
 */
export async function sendEmail(options) {
    try {
        await transporter.sendMail(options);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}