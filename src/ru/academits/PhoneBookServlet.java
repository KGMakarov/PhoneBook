package ru.academits;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.List;

public class PhoneBookServlet extends HttpServlet {


    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            PhoneBookService phoneBookService = PhoneBook.phoneBookService;
            List<Contact> contactList = phoneBookService.getAllContacts();
            resp.getOutputStream().write(phoneBookService.convert(contactList).getBytes(Charset.forName("UTF-8")));
            resp.getOutputStream().flush();
            resp.getOutputStream().close();
        } catch (Exception e) {
            System.out.println("error in PhoneBookServlet GET: ");
            e.printStackTrace();
        }
    }
}
