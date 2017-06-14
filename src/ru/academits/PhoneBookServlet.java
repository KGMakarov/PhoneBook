package ru.academits;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

public class PhoneBookServlet extends HttpServlet {
    private PhoneBookService phoneBookService = PhoneBook.phoneBookService;

    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
     /*   List<Contact> contactList = phoneBookService.getAllContacts();
        String contactListJson = phoneBookService.convert(contactList);*/
        resp.getOutputStream().print("Hello get");
}

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
       /* List<Contact> contactList = phoneBookService.getAllContacts();
        String contactListJson = phoneBookService.convert(contactList);*/
        resp.getOutputStream().print("Hello get");
    }
}
