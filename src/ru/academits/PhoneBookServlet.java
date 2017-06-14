package ru.academits;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class PhoneBookServlet extends HttpServlet {


    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            PhoneBookService phoneBookService = PhoneBook.phoneBookService;
            List<Contact> contactList = phoneBookService.getAllContacts();
            resp.getOutputStream().print(phoneBookService.convert(contactList));
        } catch (Exception e) {
            System.out.println("error in PhoneBookServlet GET: " + e);
        }
    }
}
