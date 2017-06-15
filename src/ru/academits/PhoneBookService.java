package ru.academits;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Created by Anna on 14.06.2017.
 */
public class PhoneBookService {
    private Gson gson = new GsonBuilder().create();
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

    public List<Contact> getAllContacts(){
        return contactList;
    }

    public String convert(List<Contact> contactList) {
        return gson.toJson(contactList);
    }

    private int getNewId(){
        return idSequence.addAndGet(1);
    }
}
