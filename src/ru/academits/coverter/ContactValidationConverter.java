package ru.academits.coverter;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import ru.academits.model.Contact;
import ru.academits.service.ContactValidation;

import java.util.List;

public class ContactValidationConverter {
    private Gson gson = new GsonBuilder().create();

    public String convertToJson(ContactValidation contactValidation) {
        return gson.toJson(contactValidation);
    }
}
