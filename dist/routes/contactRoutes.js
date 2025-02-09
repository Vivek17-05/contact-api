"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Contact_1 = require("../entities/Contact");
const db_config_1 = require("../db/db.config");
const router = (0, express_1.Router)();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, phoneNumber } = req.body;
    if (!email && !phoneNumber) {
        return res.status(400).json({ message: 'Email or Phone Number is required' });
    }
    const contactRepo = db_config_1.AppDataSource.getRepository(Contact_1.Contact);
    const contacts = yield contactRepo.find({
        where: [
            { email },
            { phoneNumber }
        ]
    });
    if (contacts.length === 0) {
        const newContact = contactRepo.create({
            email,
            phoneNumber,
            linkPrecedence: 'primary'
        });
        yield contactRepo.save(newContact);
        return res.json({
            contact: {
                primaryContactId: newContact.id,
                emails: [newContact.email],
                phoneNumbers: [newContact.phoneNumber],
                secondaryContactIds: []
            }
        });
    }
    let primaryContact = contacts.filter(c => c.linkPrecedence === 'primary');
    if (primaryContact.length > 1) {
        primaryContact.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        const oldPrimaryContact = primaryContact[0];
        const newerPrimaryContact = primaryContact[1];
        newerPrimaryContact.linkPrecedence = 'secondary';
        newerPrimaryContact.linkedId = oldPrimaryContact.id;
        yield contactRepo.save(newerPrimaryContact);
        yield contactRepo.createQueryBuilder().update(Contact_1.Contact).set({ linkedId: oldPrimaryContact.id }).where("linkedId = :oldPrimaryId", { oldPrimaryId: newerPrimaryContact.id }).execute();
        const allRelatedContacts = yield contactRepo.find({
            where: [{ linkedId: primaryContact[0].id }, { id: primaryContact[0].id }]
        });
        return res.json({
            contact: {
                primaryContactId: primaryContact[0].id,
                emails: [...new Set(allRelatedContacts.map(c => c.email).filter(Boolean))],
                phoneNumbers: [...new Set(allRelatedContacts.map(c => c.phoneNumber).filter(Boolean))],
                secondaryContactIds: allRelatedContacts.filter(c => c.linkPrecedence === 'secondary').map(c => c.id)
            }
        });
    }
    const existingEmails = contacts.map(c => c.email).filter(e => e);
    const existingPhones = contacts.map(c => c.phoneNumber).filter(p => p);
    const primaryContacts = contacts.find(c => c.linkPrecedence === 'primary') || contacts[0];
    const otherEmails = (yield contactRepo.find({ where: { linkedId: primaryContacts.id } })).map(c => c.email).filter(e => e);
    const otherPhones = (yield contactRepo.find({ where: { linkedId: primaryContacts.id } })).map(c => c.phoneNumber).filter(p => p);
    const secondaryContacts = (yield contactRepo.find({ where: { linkedId: primaryContacts.id } })).map(c => c.id);
    if ((email && !existingEmails.includes(email)) || (phoneNumber && !existingPhones.includes(phoneNumber))) {
        const newSecondaryContact = contactRepo.create({
            email,
            phoneNumber,
            linkedId: primaryContacts.id,
            linkPrecedence: 'secondary'
        });
        yield contactRepo.save(newSecondaryContact);
        contacts.push(newSecondaryContact);
    }
    return res.json({
        contact: {
            primaryContactId: primaryContacts.id,
            emails: [...new Set(contacts.map(c => c.email).filter(e => e).concat(otherEmails))],
            phoneNumbers: [...new Set(contacts.map(c => c.phoneNumber).filter(p => p).concat(otherPhones))],
            secondaryContactIds: contacts.filter(c => c.linkPrecedence === 'secondary').map(c => c.id).concat(secondaryContacts)
        }
    });
}));
exports.default = router;
