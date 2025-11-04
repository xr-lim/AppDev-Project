import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:utm_report_system/screens/login_screen/login_screen.dart';
import 'package:utm_report_system/screens/home_screen.dart';

class AuthScreen extends StatelessWidget {
  const AuthScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: StreamBuilder<User?>(
        stream: FirebaseAuth.instance.authStateChanges(),
        builder: (context, snapshot) {
          // user is logged in
          if (snapshot.hasData) {
            return HomeScreen(); // Replace with actual HomePage
          }

          // user is NOT logged in
          else {
            return LoginScreen(); // Replace with actual LoginPage
          }
        },
      ),
    );
  }
}
