import { Router } from 'express';
import { Contact } from '../entities/Contact';
import { AppDataSource } from '../db/db.config';

const router = Router();

router.post('/', async (req,res) => {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
        return res.status(400).json({ message: 'Email or Phone Number is required' });
    }

    const contactRepo = AppDataSource.getRepository(Contact);

    // Fetch all matching contacts
    const contacts = await contactRepo.find({
        where: [
            { email },
            { phoneNumber }
        ]
    });

    if (contacts.length === 0) {
        // Create a new primary contact
        const newContact = contactRepo.create({
            email,
            phoneNumber,
            linkPrecedence: 'primary'
        });
        await contactRepo.save(newContact);

        return res.json({
            contact: {
                primaryContactId: newContact.id,
                emails: [newContact.email],
                phoneNumbers: [newContact.phoneNumber],
                secondaryContactIds: []
            }
        });
    }
    console.log(contacts);
    // Determine the primary contact
    let primaryContact = contacts.filter(c => c.linkPrecedence === 'primary') ;

    if(primaryContact.length > 1){
        primaryContact.sort((a,b) => a.createdAt.getTime()-b.createdAt.getTime());
        const oldPrimaryContact = primaryContact[0];
        const newerPrimaryContact = primaryContact[1];
        newerPrimaryContact.linkPrecedence = 'secondary';
        newerPrimaryContact.linkedId = oldPrimaryContact.id;
        await contactRepo.save(newerPrimaryContact);

        await contactRepo.createQueryBuilder().update(Contact).set({ linkedId: oldPrimaryContact.id }).where("linkedId = :oldPrimaryId", { oldPrimaryId: newerPrimaryContact.id }).execute();
    

    const allRelatedContacts = await contactRepo.find({
        where: [{ linkedId: primaryContact[0].id }, {id: primaryContact[0].id}]
    });

    return res.json({
        contact: {
            primaryContactId: primaryContact[0].id,
            emails: [...new Set(allRelatedContacts.map(c => c.email).filter(Boolean))],
            phoneNumbers: [...new Set(allRelatedContacts.map(c => c.phoneNumber).filter(Boolean))],
            secondaryContactIds: allRelatedContacts.filter(c => c.linkPrecedence === 'secondary').map(c => c.id)
        }
    })
    }
    // If a new contact, create a secondary linked contact
    const existingEmails = contacts.map(c => c.email).filter(e => e);
    const existingPhones = contacts.map(c => c.phoneNumber).filter(p => p);
    const primaryContacts = contacts.find(c => c.linkPrecedence === 'primary') || contacts[0];

    if ((email && !existingEmails.includes(email)) || (phoneNumber && !existingPhones.includes(phoneNumber))) {
        const newSecondaryContact = contactRepo.create({
            email,
            phoneNumber,
            linkedId: primaryContacts.id,
            linkPrecedence: 'secondary'
        });
        await contactRepo.save(newSecondaryContact);
        contacts.push(newSecondaryContact);
    }

    return res.json({
        contact: {
            primaryContactId: primaryContacts.id,
            emails: [...new Set(contacts.map(c => c.email).filter(e => e))],
            phoneNumbers: [...new Set(contacts.map(c => c.phoneNumber).filter(p => p))],
            secondaryContactIds: contacts.filter(c => c.linkPrecedence === 'secondary').map(c => c.id)
        }
    });
});

export default router;
