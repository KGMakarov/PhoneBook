package ru.academits;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Anna on 14.06.2017.
 */
public class PhoneBookService {
    private Gson gson = new GsonBuilder().create();
    private List<Contact> contactList = new ArrayList();

    public List<Contact> getAllContacts(){
        return contactList;
    }

    public String convert(List<Contact> contactList) {
        return gson.toJson(contactList);
    }
}
