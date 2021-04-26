import 'package:app/ui/confirmar.dart';
import 'package:app/ui/evento.dart';
import 'package:app/ui/galeria.dart';
import 'package:app/models/evento.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path/path.dart';
import 'dart:io';
import 'package:uuid/uuid.dart';

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  int _selectedIndex = 0;
  var _widgetOptions = [];

  final firestore = FirebaseFirestore.instance;
  final storage = FirebaseStorage.instance;
  final auth = FirebaseAuth.instance;

  final _scaffoldKey = new GlobalKey<ScaffoldState>();

  String _eventoId =
      'iiBIjdqlDy8WsPGdKhcF'; // TODO obtener evento por dynamic link

  Evento _evento;

  @override
  void initState() {
    super.initState();
    auth.authStateChanges().listen((user) {
      if (user == null) {
        login();
      } else {
        fetchEvento();
      }
    });
  }

  login() {
    auth.signInAnonymously();
  }

  fetchEvento() {
    firestore.collection('eventos').doc(_eventoId).get().then((ds) => {
          if (ds.exists)
            {
              setState(() {
                _evento = Evento.fromDocumentSnapshot(ds);
                _widgetOptions = [
                  EventoPage(evento: _evento),
                  ConfirmarPage(evento: _evento),
                  GaleriaPage(evento: _evento),
                ];
              })
            }
        });
  }

  @override
  Widget build(BuildContext context) {
    if (_widgetOptions.length == 0) {
      return Scaffold(
        body: Center(
          child: Text('Cargando evento'),
        ),
      );
    }

    return SafeArea(
      child: Scaffold(
        body: _widgetOptions.elementAt(_selectedIndex),
        bottomNavigationBar: BottomNavigationBar(
          items: [
            BottomNavigationBarItem(icon: Icon(Icons.event), label: 'Evento'),
            BottomNavigationBarItem(
                icon: Icon(Icons.people), label: 'Confirmar'),
            BottomNavigationBarItem(
                icon: Icon(Icons.photo_album), label: 'Galeria')
          ],
          currentIndex: _selectedIndex,
          onTap: _onItemTapped,
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () async {
            final ImagePicker _picker = ImagePicker();
            final pickedFile =
                await _picker.getImage(source: ImageSource.camera);
            File file = File(pickedFile.path);
            if (file != null) {
              String ext = extension(file.path);
              String filename = Uuid().v1();
              Reference ref = storage
                  .ref()
                  .child('eventos/${_evento.id}/gallery')
                  .child('${filename}.${ext}');

              TaskSnapshot snapshot =
                  await ref.putFile(file).whenComplete(() async {
                showSnackBar('Foto enviada', context);

                saveImageURL(await ref.getDownloadURL());
              }).onError((error, stackTrace) async {
                showSnackBar('Error al enviar la foto', context);
              });
            }
          },
          child: Icon(Icons.camera_alt),
        ),
      ),
    );
  }

  saveImageURL(String downloadURL) {
    firestore
        .collection('eventos/${_evento.id}/gallery')
        .add({"url": downloadURL});
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  // Future getImage() async {
  //   final ImagePicker _picker = ImagePicker();
  //   final pickedFile = await _picker.getImage(source: ImageSource.camera);
  //   File file = File(pickedFile.path);
  //   if (file != null) {
  //     String ext = extension(file.path);
  //     String filename = Uuid().v1();
  //     Reference ref = storage
  //         .ref()
  //         .child('eventos/${_evento.id}/gallery')
  //         .child('${filename}.${ext}');
  //
  //     TaskSnapshot snapshot = await ref.putFile(file).whenComplete(() async {
  //       // showSnackBar('Foto enviada');
  //     }).onError((error, stackTrace) async {
  //       // showSnackBar('Foto enviada');
  //     });
  //   }
  // }

  showSnackBar(String text, BuildContext context) {
    final snackBar = SnackBar(content: Text(text));
    ScaffoldMessenger.of(context).showSnackBar(snackBar);

    // _scaffoldKey.currentState.showSnackBar(snackBar);
  }
}
