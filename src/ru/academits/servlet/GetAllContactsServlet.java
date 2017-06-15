package ru.academits.servlet;

import ru.academits.PhoneBook;
import ru.academits.model.Contact;
import ru.academits.service.PhoneBookService;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.nio.charset.Charset;
import java.util.List;

public class GetAllContactsServlet extends HttpServlet {


    protected void doGet(HttpServletRequest req, HttpServletResponse resp) {
        try {
            PhoneBookService phoneBookService = PhoneBook.phoneBookService;
            List<Contact> contactList = phoneBookService.getAllContacts();
            resp.getOutputStream().write(phoneBookService.convertToJson(contactList).getBytes(Charset.forName("UTF-8")));
            resp.getOutputStream().flush();
            resp.getOutputStream().close();
        } catch (Exception e) {
            System.out.println("error in GetAllContactsServlet GET: ");
            e.printStackTrace();
        }
    }
}
