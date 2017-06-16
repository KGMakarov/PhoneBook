// Class to represent a row in the seat reservations grid
function Contact(firstName, lastName, phone) {
    this.firstName = firstName();
    this.lastName = lastName();
    this.phone = phone();
    this.checked = ko.observable(false);
    this.shown = ko.observable(true);
}

function contactToString(contact) {
    var note = "(";
    note += contact.firstName + ", ";
    note += contact.lastName + ", ";
    note += contact.phone;
    note += ")";
    return note;
}

// Overall viewmodel for this screen, along with initial state
function PhoneBookModel() {
    var self = this;

    self.validation = ko.observable(false);

    self.serverValidation = ko.observable(false);

    self.firstName = ko.observable("");
    self.lastName = ko.observable("");
    self.phone = ko.observable("");

   /* self.filteredText = ko.observable("");
    self.selectAll = ko.observable(false);

    self.selectAll.subscribe(function (selectAllValue) {
        _.each(self.rows(), function (contact) {
            if (contact.shown()) {
                contact.checked(selectAllValue);
            }
        })
    });

    self.calcTextForDeleteDialog = function (rows) {
        var note = _.map(rows, function (contact) {
            return contactToString(contact);
        }).join(", ");
        note = "[" + note + "]";
        return note;
    };*/

    self.firstNameError = ko.computed(function () {
        if (self.firstName()) {
            return {
                message: "",
                error: false
            };
        }
        return {
            message: "Поле Имя должно быть заполнено.",
            error: true
        };
    });

    self.lastNameError = ko.computed(function () {
        if (!self.lastName()) {
            return {
                message: "Поле Фамилия должно быть заполнено.",
                error: true
            };
        }
        return {
            message: "",
            error: false
        };
    });

    self.phoneError = ko.computed(function () {
        if (!self.phone()) {
            return {
                message: "Поле Телефон должно быть заполнено.",
                error: true
            };
        }
        var sameContact = _.find(self.rows(), {phone: self.phone()});

        if (sameContact) {
            return {
                message: "Номер телефона не должен дублировать другие номера в телефонной книге.",
                error: true
            };
        }
        return {
            message: "",
            error: false
        };
    });

    self.serverError = ko.observable("");

    self.hasError = ko.computed(function () {
        return self.lastNameError().error || self.firstNameError().error || self.phoneError().error;
    });

    self.rows = ko.observableArray([]);
   /* self.selectedContacts = ko.observableArray([]);*/

    /*self.textForDeleteDialog = ko.computed(function () {
        var checkedContactList = _.filter(self.rows(), function (contact) {
            return contact.checked() && contact.shown();
        });

        if (checkedContactList.length == 0) {
            return "Выберите контакты для удаления.";
        } else if (checkedContactList.length == 1) {
            return "Вы уверены, что хотите удалить контакт:\r\n" + contactToString(checkedContactList[0]) + "?";
        } else {
            return "Вы уверены, что хотите удалить контакты:\r\n" + self.calcTextForDeleteDialog(checkedContactList) + "?";
        }
    });*/

    // Operations
    self.addContact = function () {
        if (self.hasError()) {
            self.validation(true);
            self.serverValidation(false);
            return;
        }

        var contact = new Contact(self.firstName, self.lastName, self.phone);
        $.ajax({
            type: "POST",
            url: "/phonebook/add",
            data: JSON.stringify(contact)
        }).done(function() {
            self.serverValidation(false);
        }).fail(function(ajaxRequest) {
            var contactValidation = $.parseJSON(ajaxRequest.responseText);
            self.serverError(contactValidation.error);
            self.serverValidation(true);
        }).always(function() {
            $.ajax({
                type: "GET",
                url: "/phonebook/get/all",
                success: self.getAllSuccessCallback
            });
        });

        self.firstName("");
        self.lastName("");
        self.phone("");
        self.validation(false);
    };

   /* self.deleteContact = function (contact) {
        var content = "Вы уверены, что хотите удалить контакт:\r\n" + contactToString(contact) + "?";
        openDeleteDialog("Удалить контакт", content,
            function () {
                self.rows.remove(contact);
            }
        )
    };

    self.deleteSelectedContact = function () {
        var checkedContactList = _.filter(self.rows(), function (contact) {
            return contact.checked() && contact.shown();
        });
        if (checkedContactList.length == 0) {
            openAlert("Нет выбранных контактов", self.textForDeleteDialog());
            return;
        }
        openDeleteDialog("Удалить контакты", self.textForDeleteDialog(),
            function () {
                self.rows(_.filter(self.rows(), function (contact) {
                    return !contact.checked() || !contact.shown();
                }));
            }
        );
    };*/

   /* self.filterContact = function () {
        _.each(self.rows(), function (contact) {
            var hidden = contact.firstName.toLowerCase().indexOf(self.filteredText().toLowerCase()) == -1 &&
                contact.lastName.toLowerCase().indexOf(self.filteredText().toLowerCase()) == -1 &&
                contact.phone.toLowerCase().indexOf(self.filteredText().toLowerCase()) == -1;
            contact.shown(!hidden);
        })
    };

    self.resetFilter = function () {
        _.each(self.rows(), function (contact) {
            contact.shown(true);
        });
        self.filteredText("");
    }*/

    self.getAllSuccessCallback = function (msg) {
        var contactListFormServer = $.parseJSON(msg);
        var contactListForClient = self.convertContactList(contactListFormServer);
        self.rows(contactListForClient);
    };

    self.convertContactList = function (contactListFormServer) {
        var contactListForClient = [];
        contactListFormServer.forEach(function (contact, i) {
            var contactForClient = {
                id: contact.id,
                firstName: contact.firstName,
                lastName: contact.lastName,
                phone: contact.phone,
                checked: ko.observable(false),
                shown: ko.observable(true),
                number: i + 1
            };
            contactListForClient.push(contactForClient);
        });
        return contactListForClient;
    };
}

function openDeleteDialog(title, content, onOk, onCancel) {
    $(".delete-dialog").text(content).dialog({
        autoOpen: false,
        modal: true,
        title: title,
        buttons: {
            "Удалить": function () {
                onOk.call();
                $(this).dialog("close");
            },
            "Отмена": function () {
                if (onCancel) {
                    onCancel.call();
                }
                $(this).dialog("close");
            }
        }
    });
    $(".delete-dialog").dialog("open");
}

function openAlert(title, content, onOk) {
    $(".alert").text(content).dialog({
        autoOpen: false,
        modal: true,
        title: title,
        buttons: {
            "Ок": function () {
                if (onOk) {
                    onOk.call();
                }
                $(this).dialog("close");
            }
        }
    });
    $(".alert").dialog("open");
}

$(document).ready(function () {
    var phoneBookModel = new PhoneBookModel();
    ko.applyBindings(phoneBookModel);

    $.ajax({
        type: "GET",
        url: "/phonebook/get/all",
        success: phoneBookModel.getAllSuccessCallback
    });
});

