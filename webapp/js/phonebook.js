$(document).ready(function () {

    var phoneBook = {
        rows: [],
        backupRows: []
    };

    var idSequence = 0;

    var numberForDelete;

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

    function setRowsNumbers() {
        $(".table-phonebook").find("tbody").find("tr").each(function (i, tr) {
            $(tr).find("td:eq(1)").text(i + 1);
        })
    }

    function resetValidation() {
        $(".last-name-input").removeClass("input-error");
        $(".first-name-input").removeClass("input-error");
        $(".phone-input").removeClass("input-error");

        $(".last-name-error-message").removeClass("error-message").text("");
        $(".first-name-error-message").removeClass("error-message").text("");
        $(".phone-error-message").removeClass("error-message").text("");
    }


    function allotEmptyFields(lastName, firstName, phone) {
        if (!lastName) {
            $(".last-name-error-message").addClass("error-message").text("Поле Фамилия должно быть заполнено.");
            $(".last-name-input").addClass("input-error");
        }
        if (!firstName) {
            $(".first-name-error-message").addClass("error-message").text("Поле Имя должно быть заполнено.");
            $(".first-name-input").addClass("input-error");
        }
        if (!phone) {
            $(".phone-error-message").addClass("error-message").text("Поле Телефон должно быть заполнено.");
            $(".phone-input").addClass("input-error");
        }
    }

    function convertContactToString(contact) {
        var note = "(";
        note += contact.firstName + ", ";
        note += contact.lastName + ", ";
        note += contact.phone;
        note += ")";
        return note;
    }

    function calcTextForDeleteDialog(checkedArray) {
        if (checkedArray.length == 0) {
            return "Выберите контакты для удаления.";
        } else if (checkedArray.length == 1) {
            return "Вы уверены, что хотите удалить контакт:\r\n" + convertCheckedContactToString(phoneBook.rows, checkedArray) + "?";
        }
        return "Вы уверены, что хотите удалить контакты:\r\n" + convertCheckedContactToString(phoneBook.rows, checkedArray) + "?";
    }

    function convertCheckedContactToString(rows, checkedArray) {
        var note = "[";
        for (var i = 0; i < rows.length; i++) {
            if ($.inArray(rows[i].id.toString(), checkedArray) !== -1) {
                note += convertContactToString(rows[i]);
                note += ",";
            }
        }
        note = note.substring(0, note.length - 1);
        note += "]";
        return note;
    }

    function validateCorrectPhoneField(phone) {
        if (!phone.match(/[a-zа-я]/i)) {
            return true;
        }
        $(".phone-error-message").addClass("error-message").text("Поле телефон не должно содержать буквы.");
        $(".phone-input").addClass("input-error");
        return false;
    }

    function validateNewPhoneField(phone) {
        var newPhone = true;

        for (var i = 0; i < phoneBook.backupRows.length; i++) {
            if (phoneBook.backupRows[i].phone == phone) {
                newPhone = false;
                break;
            }
        }

        if (!newPhone) {
            $(".phone-error-message").addClass("error-message").text("Номер телефона не должен дублировать другие номера в телефонной книге.");
            $(".phone-input").addClass("input-error");
        }
        return newPhone;
    }

    $(".select-all").change(function () {
        var checked = $(this).is(":checked");
        $(".check-contact").prop("checked", checked);
    });

    $(".filter-button").click(function () {
        var text = $(".filter-input").val().toLowerCase();
        phoneBook.rows = JSON.parse(JSON.stringify(phoneBook.backupRows));
        for (var i = phoneBook.rows.length - 1; i >= 0; i--) {
            if (phoneBook.rows[i].firstName.toLowerCase().indexOf(text) == -1 &&
                phoneBook.rows[i].lastName.toLowerCase().indexOf(text) == -1 &&
                phoneBook.rows[i].phone.toLowerCase().indexOf(text) == -1) {
                phoneBook.rows.splice(i, 1);
            }
        }

        renderTable();
    });


    $(".reset-filter-button").click(function () {
        $(".filter-input").val("");
        phoneBook.rows = JSON.parse(JSON.stringify(phoneBook.backupRows));
        renderTable();
    });


    function collectChecked() {
        var checkedArray = [];

        $(".table-phonebook").find("tbody").find("tr").each(function (i, tr) {
            var number = $(tr).find(".check-contact:checked").attr("number");
            if (number) {
                checkedArray.push(number);
            }
        });

        return checkedArray;
    }

    $(".delete-checked-contact-button").click(function () {

        var checkedArray = collectChecked();
        var textForDeleteDialog = calcTextForDeleteDialog(checkedArray);
        if (checkedArray.length == 0) {
            openAlert("Нет выбранных контактов", textForDeleteDialog);
            return;
        }
        openDeleteDialog("Удалить контакты", textForDeleteDialog,
            function () {
                var checkedArray = collectChecked();
                deleteArrayFromRows(checkedArray, phoneBook.rows);
                deleteArrayFromRows(checkedArray, phoneBook.backupRows);
                renderTable();
            }
        );
    });


    function deleteArrayFromRows(checkedArray, rows) {
        for (var i = rows.length - 1; i >= 0; i--) {
            if ($.inArray(rows[i].id.toString(), checkedArray) !== -1) {
                rows.splice(i, 1);
            }
        }
    }

    function deleteItemFromRows(number, rows) {
        for (var i = 0; i <= rows.length; i++) {
            if (rows[i].id == number) {
                rows.splice(i, 1);
                break;
            }
        }
    }

    function checkById(rows, number, checked) {
        for (var i = 0; i <= rows.length; i++) {
            if (rows[i].id == number) {
                rows[i].checked = checked;
                break;
            }
        }
    }

    function renderTable() {
        $(".table-phonebook-tr").remove();
        phoneBook.rows.forEach(function (currentValue) {
            var tr = $("<tr class='table-phonebook-tr'><td><label class='select-me-label'><input type='checkbox' class='check-contact'/></label></td><td class='number'></td><td></td><td></td><td class='phone'></td><td><button class='delete-button' type='button'>Удалить</button></td></tr>");
            tr.find(".check-contact").prop('checked', currentValue.checked);
            tr.find("td:eq(2)").text(currentValue.lastName);
            tr.find("td:eq(3)").text(currentValue.firstName);
            tr.find("td:eq(4)").text(currentValue.phone);


            $(".table-phonebook").find("tbody").append(tr);

            $(tr).find("button.delete-button").attr("number", currentValue.id);
            $(tr).find(".check-contact").attr("number", currentValue.id);

            $(tr).find(".check-contact").change(function () {
                var id = $(this).attr("number");
                var checked = $(this).is(":checked");
                checkById(phoneBook.rows, id, checked);
                checkById(phoneBook.backupRows, id, checked);
            });


            tr.find(".delete-button").click(function () {
                numberForDelete = $(this).attr("number");
                var content = calcTextForDeleteDialog([$(this).attr("number")]);
                openDeleteDialog("Удалить контакт", content,
                    function () {
                        deleteItemFromRows(numberForDelete, phoneBook.rows);
                        deleteItemFromRows(numberForDelete, phoneBook.backupRows);
                        renderTable();
                    }
                )
            });
        });
        setRowsNumbers();
    }

    $(".add-contact-button").click(function () {
        resetValidation();

        var lastName = $(".last-name-input").val();
        var firstName = $(".first-name-input").val();
        var phone = $(".phone-input").val();


        if (!lastName || !firstName || !phone) {
            allotEmptyFields(lastName, firstName, phone);
            return;
        }
        if (!validateCorrectPhoneField(phone)) {
            return;
        }
        if (!validateNewPhoneField(phone)) {
            return;
        }

        var row = {lastName: lastName, firstName: firstName, phone: phone, id: idSequence++, checked: false};

        phoneBook.rows.push(row);
        phoneBook.backupRows.push(row);

        renderTable();
        $(".form").find("input").val("");
    })
});

