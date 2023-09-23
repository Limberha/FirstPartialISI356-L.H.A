/*Solution

SOLID Principles:
Single Responsibility Principle: La clase LibraryManager se ocupa únicamente de la lógica de la biblioteca, mientras que el servicio EmailService se ocupa del envío de correos electrónicos.
Open/Closed Principle: Las clases están abiertas para extensión (por ejemplo, añadiendo más tipos de notificaciones) pero cerradas para modificación.
Liskov Substitution Principle: User implementa la interfaz IObserver, lo que significa que se puede sustituir por cualquier otro objeto que también implemente la interfaz.
Dependency Inversion Principle: Se inyecta IEmailService en LibraryManager, lo que significa que LibraryManager no depende de una implementación concreta.

Inyección de Dependencias:
Inyectar IEmailService en LibraryManager.

Lambda Expressions:
Usar expresiones lambda en funciones como find y forEach.

Singleton Pattern:
Garantizar que solo haya una instancia de LibraryManager con el método getInstance.

Observer Pattern:
Los usuarios (User) se registran como observadores y son notificados cuando se añade un nuevo libro.

Builder Pattern:
Se utiliza para construir instancias de Book de una manera más limpia y escalable.

Refactorización:
eliminar el uso de ANY mejorar el performance

Aspectos (Opcional)
Puedes anadir logs de info, warning y error en las llamadas, para un mejor control

Diseño por Contrato (Opcional):
Puedes anadir validaciones en precondiciones o postcondiciones como lo veas necesario*/

interface IBook {
    title: string;
    author: string;
    ISBN: string; //( ISBN International Standard Book Number)
}

interface ILoan { //(Loan => prestamo)
    ISBN: string;
    userID: string;
    date: Date;
}

interface IEmailService {
    sendEmail(userID: string, message: string): void;
}

interface IObserver {
    update(book: IBook): void;
}

class EmailService implements IEmailService {
    sendEmail(userID: string, message: string) {
        console.log(`Enviando email a ${userID}: ${message}`);
        // (Implementación real del envío de correo electrónico)
    }
}

class User implements IObserver {
    constructor(private userID: string) {}

    update(book: IBook) {
        console.log(`${this.userID} ha recibido una notificación sobre el libro "${book.title}"`);
    }
}

class LibraryManager {
    private static instance: LibraryManager;
    private books: IBook[] = [];
    private loans: ILoan[] = [];
    private observers: IObserver[] = [];

    private constructor(private emailService: IEmailService) {}

    static getInstance(emailService: IEmailService) {
        if (!LibraryManager.instance) {
            LibraryManager.instance = new LibraryManager(emailService);
        }
        return LibraryManager.instance;
    }

    addObserver(observer: IObserver) {
        this.observers.push(observer);
    }

    addBook(title: string, author: string, ISBN: string) {
        const book: IBook = { title, author, ISBN };
        this.books.push(book);
        this.notifyObservers(book);
    }

    removeBook(ISBN: string) {
        const index = this.books.findIndex(b => b.ISBN === ISBN);
        if (index !== -1) {
            this.books.splice(index, 1);
        }
    }

    search(query: string) {
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

    private sendEmail(userID: string, message: string) {
        this.emailService.sendEmail(userID, message);
    }

    private notifyObservers(book: IBook) {
        this.observers.forEach(observer => observer.update(book));
    }
}

const emailService = new EmailService();
const library = LibraryManager.getInstance(emailService);

const user = new User("user01");
library.addObserver(user);

library.addBook("El Gran Gatsby", "F. Scott Fitzgerald", "123456789");
library.addBook("1984", "George Orwell", "987654321");
library.loanBook("123456789", "user01");

