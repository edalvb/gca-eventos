import 'package:flutter/material.dart';
import 'package:app/models/evento.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class GaleriaPage extends StatefulWidget {
  final Evento evento;

  GaleriaPage({this.evento});

  @override
  _GaleriaPageState createState() => _GaleriaPageState();
}

class _GaleriaPageState extends State<GaleriaPage> {
  final firestore = FirebaseFirestore.instance;

  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
      stream: firestore
          .collection("eventos/${widget.evento.id}/gallery")
          .snapshots(),
      builder: (_, AsyncSnapshot<QuerySnapshot> snapshot) {
        var imageDocs = snapshot.data?.docs ?? [];
        var imageList = imageDocs
            .map((doc) => FadeInImage.assetNetwork(
                  image: doc.get("url"),
                  placeholder: 'assets/cargando.gif',
                  fit: BoxFit.cover,
                ))
            .toList();
        return GridView.count(
          crossAxisCount: 2,
          crossAxisSpacing: 8,
          mainAxisSpacing: 8,
          padding: EdgeInsets.all(8),
          children: imageList,
        );
      },
    );
  }
}
