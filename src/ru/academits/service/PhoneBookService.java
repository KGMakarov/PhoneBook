package ru.academits.service;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import ru.academits.model.Contact;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Created by Anna on 14.06.2017.
 */
public class PhoneBookService {

    private List<Contact> contactList = new ArrayList();
    private AtomicInteger idSequence = new AtomicInteger(0);

    {
        Contact contact = new Contact();
        contact.setId(getNewId());
        contact.setFirstName("Иван");
        contact.setLastName("Иванов");
        contact.setPhone("9123456789");
        contactList.add(contact);
    }

    public List<Contact> getAllContacts() {
        return contactList;
    }


    private int getNewId() {
        return idSequence.addAndGet(1);
    }

    private boolean isExistContactWithPhone(String phone) {
        for (Contact contact : contactList) {
            if (contact.getPhone().equals(phone)) {
                return true;
            }
        }
        return false;
    }

    public ContactValidation validateContact(Contact contact) {

        ContactValidation contactValidation = new ContactValidation();
        contactValidation.setValid(true);
        if (contact.getFirstName().isEmpty()) {
            contactValidation.setValid(false);
            contactValidation.setFirstNameError("Имя должно быть не пустым");
        }

        if (contact.getLastName().isEmpty()) {
            contactValidation.setValid(false);
            contactValidation.setLastNameError("Фамилия должно быть не пустым");
        }

        if (contact.getPhone().isEmpty()) {
            contactValidation.setValid(false);
            contactValidation.setPhoneError("Телефон должно быть не пустым");
        }

        if (isExistContactWithPhone(contact.getPhone())) {
            contactValidation.setValid(false);
            contactValidation.setPhoneError("Телефон должно быть уникальным");
        }
        return contactValidation;
    }

    public ContactValidation addContact(Contact contact) {
        ContactValidation contactValidation = validateContact(contact);
        if (contactValidation.isValid()) {
            contactList.add(contact);
        }
        return contactValidation;
    }
}
