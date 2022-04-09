const bookList = document.querySelector('#book-list');
const form=document.querySelector('#add-book-form')

// create element & render book
function renderBook(doc){
    let li = document.createElement('li');
    let Tytuł = document.createElement('span');
    let Gatunek = document.createElement('span');
    let Ilość = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    Tytuł.textContent = doc.data().Tytuł;
    Gatunek.textContent = doc.data().Gatunek;
    Ilość.numberContent = doc.data().Ilość;
    cross.textContent = 'x';

    li.appendChild(Tytuł);
    li.appendChild(Gatunek);
    li.appendChild(Ilość);
    li.appendChild(cross);

    bookList.appendChild(li);

    // deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('Książki').doc(id).delete();
    });
}

// // getting data
// db.collection('Książki').orderBy('Gatunek').get().then(snapshot => {
//     snapshot.docs.forEach(doc => {
//         renderBook(doc);
//     });
// });

// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('Książki').add({
        Tytuł: form.Tytuł.value,
        Gatunek: form.Gatunek.value,
        Ilość: form.Ilość.value
    });
    form.Tytuł.value = '';
    form.Gatunek.value = '';
    form.Ilość.value = '';
});

// real-time listener
db.collection('Książki').orderBy('Gatunek').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if(change.type == 'added'){
            renderBook(change.doc);
        } else if (change.type == 'removed'){
            let li = bookList.querySelector('[data-id=' + change.doc.id + ']');
            bookList.removeChild(li);
        }
    });
});