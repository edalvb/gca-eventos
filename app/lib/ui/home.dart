import 'package:app/ui/confirmar.dart';
import 'package:app/ui/evento.dart';
import 'package:app/ui/galeria.dart';
import 'package:app/models/evento.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  int _selectedIndex = 0;
  var _widgetOptions = [];

  final firestore = FirebaseFirestore.instance;

  String _eventoId =
      'iiBIjdqlDy8WsPGdKhcF'; // TODO obtener evento por dynamic link

  Evento _evento;

  @override
  void initState() {
    super.initState();
    firestore.collection('eventos').doc(_eventoId).get().then((ds) => {
          if (ds.exists)
            {
              setState(() {
                _evento = Evento.fromDocumentSnapshot(ds);
                _widgetOptions = [
                  EventoPage(evento: _evento),
                  GaleriaPage(evento: _evento),
                  ConfirmarPage(evento: _evento),
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
          onPressed: null,
          child: Icon(Icons.camera_alt),
        ),
      ),
    );
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }
}
