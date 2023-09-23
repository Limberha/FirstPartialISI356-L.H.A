/*Aplicación de Administración de Biblioteca

Eres el desarrollador principal de una aplicación de administración de biblioteca. En un intento por hacer que la aplicación sea "fácil de usar",
 se ha agregado una gran cantidad de funcionalidad en una única clase, y se ha utilizado un único método para resolver diferentes tareas.

La clase LibraryManager no sólo se encarga de agregar o eliminar libros, sino que también gestiona los préstamos, las devoluciones y 
hasta la notificación por correo electrónico a los usuarios. Asimismo, se ha optado por usar un único método para realizar búsquedas, 
sin importar si es por título, autor o ISBN, complicando su implementación.

Se ha identificado que la clase es muy difícil de mantener y modificar. Tu tarea es estudiar el código, identificar los problemas y
 considerar cómo podría refactorizarse para mejorar su diseño y estructura.*/
class LibraryManagerEx {
    books: any[] = [];
    loans: any[] = [];

    addBook(title: string, author: string, ISBN: string) {
        this.books.push({ title, author, ISBN });
    }

    removeBook(ISBN: string) {
        const index = this.books.findIndex(b => b.ISBN === ISBN);
        if (index !== -1) {
            this.books.splice(index, 1);
        }
    }

    search(query: string) {
        // Usa el mismo método para buscar por título, autor o ISBN
        return this.books.filter(book =>
            book.title.includes(query) ||
            book.author.includes(query) ||
            book.ISBN === query
        );
    }

    loanBook(ISBN: string, userID: string) {
        const book = this.books.find(b => b.ISBN === ISBN);
        if (book) {
            this.loans.push({ ISBN, userID, date: new Date() });
            this.sendEmail(userID, `Has solicitado el libro ${book.title}`);
        }
    }

    returnBook(ISBN: string, userID: string) {
        const index = this.loans.findIndex(loan => loan.ISBN === ISBN && loan.userID === userID);
        if (index !== -1) {
            this.loans.splice(index, 1);
            this.sendEmail(userID, `Has devuelto el libro con ISBN ${ISBN}. ¡Gracias!`);
        }
    }

    sendEmail(userID: string, message: string) {
        console.log(`Enviando email a ${userID}: ${message}`);
        // Implementación ficticia del envío de correo
    }
}

const libraryex = new LibraryManagerEx();
libraryex.addBook("El Gran Gatsby", "F. Scott Fitzgerald", "123456789");
libraryex.addBook("1984", "George Orwell", "987654321");
libraryex.loanBook("123456789", "user01");
