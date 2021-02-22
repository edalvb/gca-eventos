(function () {

    var db = firebase.firestore();

    // Obtener una colección completa
    db.collection('eventos')
        .get()
        .then(
            querySnapshot => {
                querySnapshot.forEach(doc => {
                    console.log(doc.data());
                    console.log(doc.id);
                })
            }
        );

    // Obtener una subcolección
    db.collection('eventos/fy86WsWnnD4XMlL2iW4M/confirmaciones')
        .get()
        .then(
            querySnapshot => {
                querySnapshot.forEach(doc => {
                    console.log(doc.data());
                    console.log(doc.id);
                })
            }
        );

    // Obtener una subcolección
    db.collection('eventos').doc('fy86WsWnnD4XMlL2iW4M')
        .get()
        .then(querySnapshot => {
            console.log(querySnapshot.data());
            console.log(querySnapshot.id);
        });

    // Obtener un documento mediante una query
    db.collection('eventos/fy86WsWnnD4XMlL2iW4M/confirmaciones')
        .where('asistentes', '==', 'Familia de Aguilera')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                console.log(doc.data());
                console.log(doc.id);
            })
        });

    // Obtener actualizaciones en tiempo real
    db.collection('eventos/fy86WsWnnD4XMlL2iW4M/confirmaciones')
        .onSnapshot(
            snapshot => {
                snapshot.forEach(doc => {
                    console.log('Actualización en tiempo real');
                    console.log(doc.data());
                    console.log(doc.id);
                })
            }
        );

})();