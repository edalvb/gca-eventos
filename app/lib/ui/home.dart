import 'package:app/ui/confirmar.dart';
import 'package:app/ui/evento.dart';
import 'package:app/ui/galeria.dart';
import 'package:flutter/material.dart';

class Home extends StatefulWidget {
  @override
  _HomeState createState() => _HomeState();
}

class _HomeState extends State<Home> {
  int _selectedIndex = 0;
  final _widgetOptions = [Evento(), Confirmar(), Galeria()];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _widgetOptions.elementAt(_selectedIndex),
      bottomNavigationBar: BottomNavigationBar(
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.event), label: 'Evento'),
          BottomNavigationBarItem(icon: Icon(Icons.people), label: 'Confirmar'),
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
    );
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }
}
