import 'package:flutter/material.dart';
import 'package:app/models/evento.dart';

class ConfirmarPage extends StatelessWidget {
  final Evento evento;

  ConfirmarPage({this.evento});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text('Confirmar'),
    );
  }
}
