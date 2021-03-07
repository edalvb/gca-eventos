import 'package:app/ui/home.dart';
import 'package:flutter/material.dart';

void main() {
  runApp(App());
}

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Eventos App',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: Home(),
    );
  }
}