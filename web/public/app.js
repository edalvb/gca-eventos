(function () {

    var db = firebase.firestore();

    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    new Vue({
        el: '#app',
        data: {
            authorized: null,
            eventos: null,
            currentEvent: {
                titulo: "",
                descripcion: "",
                fecha: "",
                archivado: false,
                organizador: ""
            },
            currentEventErrors: { dirty: false },
            modal: null,
            currentImage: null,
        },
        created: function () {
            // Operaciones que se ejecutan al inicio
            var self = this;
            firebase.auth().onAuthStateChanged(user => {
                if (!user) {
                    // Configuramos firebaseUI
                    var uiConfig = {
                        signInFlow: 'popup',
                        // signInSuccessUrl: '/',
                        callbacks: {
                            signInSuccessWithAuthResult: (authResult, redirectUrl) => {
                                return false;
                            }
                        },
                        signInOptions: [
                            firebase.auth.EmailAuthProvider.PROVIDER_ID
                        ],
                        CredentialHelper: firebaseui.auth.CredentialHelper.NONE
                    }

                    // The start method will wait until the DOM is loaded.
                    ui.start('#firebaseui-auth-container', uiConfig);

                } else if (user.uid === 'aI2nIe6I8Ngt9K875WYmTFt274A2') {
                    self.authorized = true;
                    self.init();
                } else {
                    firebase.auth().signOut();
                }
            });
        },
        methods: {
            // funciones que controlan el flujo de la app
            init: function () {
                this.fechEventos();
            },
            fechEventos: function () {
                db.collection('eventos')
                    .where('archivado', '==', false)
                    .onSnapshot(snaptshot => {
                        var eventos = {};
                        snaptshot.forEach(doc => {
                            var evento = doc.data();
                            evento.fecha = evento.fecha.toDate();
                            eventos[doc.id] = evento;
                        });
                        this.eventos = eventos;

                        // Vinculamos el modal a la variable modal
                        this.modal = new bootstrap.Modal(document.getElementById('eventoFormModal'));
                    });
            },
            guardarEvento: function () {
                // console.log(this.currentEvent.fecha);
                if (this.isValidEvent()) {
                    const milli = Math.floor(moment(this.currentEvent.fecha).valueOf() / 1000);
                    this.currentEvent.fecha = new firebase.firestore.Timestamp(milli, 0);
                    if (!this.currentEventId) {
                        db.collection('eventos')
                            .add(this.currentEvent)
                            .then(docRef => {
                                this.resetEventoForm();
                            })
                            .catch(error => {
                                console.log(error);
                            })
                    } else {
                        console.log(this.currentEventId);
                        db.collection('eventos')
                            .doc(this.currentEventId)
                            .update(this.currentEvent)
                            .then(docRef => { this.resetEventoForm(); })
                            .catch(error => { console.log(error) })
                    }
                }
            },
            isValidEvent: function () {
                var isValid = true;
                this.currentEventErrors = { dirty: true };
                if (this.currentEvent.titulo.trim().length == 0) {
                    this.currentEventErrors.titulo = 'Indica un título';
                    isValid = false;
                }

                if (this.currentEvent.descripcion.trim().length == 0) {
                    this.currentEventErrors.descripcion = 'Indica una descripción';
                    isValid = false;
                }

                if (isNaN(Date.parse(this.currentEvent.fecha))) {
                    this.currentEventErrors.fecha = 'Indica una fecha';
                    isValid = false;
                } else if (Date.parse(this.currentEvent.fecha) - Date.parse(new Date) < 0) {
                    this.currentEventErrors.fecha = 'Indica una fecha en el futuro';
                    isValid = false;
                }

                if (this.currentEvent.organizador.trim().length == 0) {
                    this.currentEventErrors.organizador = 'Indica un organizador';
                    isValid = false;
                } else if (!this.validEmail(this.currentEvent.organizador)) {
                    this.currentEventErrors.organizador = 'Indica un email válido';
                    isValid = false;
                }

                return isValid;

            },
            validEmail: function (email) {
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(email).toLowerCase());
            },
            resetEventoForm: function () {
                this.modal.hide();

                this.currentEventErrors = { dirty: false };
                this.currentEvent = {
                    titulo: "",
                    descripcion: "",
                    fecha: "",
                }
            },
            /**
             * Convierte de Date a un tipo de dato Timestamp que Firebase pueda entender y lo retorna.
             * @param {Date} fecha 
             */
            convierteFecha: function (fecha) {
                return new firebase.firestore.Timestamp(Math.floor(moment(fecha).valueOf() / 1000), 0);
            },
            editarEvento: function (evento, id) {
                Object.assign(this.currentEvent, evento);

                this.currentEvent.fecha = moment(this.currentEvent.fecha).format("YYYY-MM-DD");

                this.currentEventId = id;

                this.modal.show();

            },
            borrarEvento: function (id) {
                db.collection('eventos').doc(id).delete();
            },
            archivarEvento: function (id) {
                db.collection('eventos')
                    .doc(id)
                    .update({ archivado: true });
            },
            loadImage: function (id) {
                document.getElementById(`inputImage-${id}`).click();
            },
            uploadImage: function (event, id) {
                console.log(event.target);
                if (event.target.files.length) {
                    var file = event.target.files[0];
                    var fileExt = file.name.split('.').pop();
                    var storageRef = firebase.storage().ref();
                    var imageRef = storageRef.child(`eventos/${id}/imagen_destacada-${fileExt}`);
                    imageRef.put(file).then(function (snapshot) {
                        if (snapshot && snapshot.state != "success") {
                            alert("No se pudo subir");
                        } else {
                            snapshot.ref.getDownloadURL()
                                .then(downloadURL => {
                                    db.collection('eventos')
                                        .doc(id)
                                        .update({ imagenDestacada: downloadURL });
                                });
                        }
                    })
                }
            },
            setCurrentImage(evento) {
                this.currentImage = evento.imagenDestacada;
            },
            logout: function () {
                firebase.auth().signOut();
            }
        }
    });

})();