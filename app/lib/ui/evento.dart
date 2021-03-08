import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:app/models/evento.dart';

class EventoPage extends StatelessWidget {
  final Evento evento;

  EventoPage({this.evento});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          Text(
            evento.titulo.toUpperCase(),
            style: Theme.of(context).textTheme.headline3,
            textAlign: TextAlign.center,
          ),
          Container(
            padding: EdgeInsets.all(16),
            child: Image.network(evento.imagenDestacada),
          ),
          Text(
            evento.descripcion,
            style: Theme.of(context).textTheme.bodyText1,
          )
        ],
      ),
    );
  }
}
