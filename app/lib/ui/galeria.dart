import 'package:flutter/material.dart';
import 'package:app/models/evento.dart';

class GaleriaPage extends StatelessWidget {
  final Evento evento;

  GaleriaPage({this.evento});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text('Galeria'),
    );
  }
}
