package ru.academits;

import ru.academits.coverter.ContactConverter;
import ru.academits.coverter.ContactValidationConverter;
import ru.academits.service.ContactValidation;
import ru.academits.service.PhoneBookService;

/**
 * Created by Anna on 14.06.2017.
 */
public class PhoneBook {
    public static PhoneBookService phoneBookService = new PhoneBookService();

    public static ContactConverter contactConverter = new ContactConverter();

    public static ContactValidationConverter contactValidationConverter = new ContactValidationConverter();
}
