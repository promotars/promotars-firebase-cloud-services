import 'package:flutter/material.dart';
import 'package:promotars_flutter_web_landing_page/screens/home.dart';
import 'package:promotars_flutter_web_landing_page/screens/privacypolicy.dart';
import 'package:promotars_flutter_web_landing_page/screens/termsAndCondition.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_colors.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_config.dart';
import 'package:promotars_flutter_web_landing_page/utils/routes.dart';
import 'package:url_strategy/url_strategy.dart';

void main() {
  setPathUrlStrategy(); // to remove /#/ in url from web navigation bar
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppConfig.tabBarText,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: AppColors.primary),
        useMaterial3: true,
      ),
      initialRoute: AppRoute.home,
      routes: {
        AppRoute.home: (context) => const Home(),
        AppRoute.privacyPolicy: (context) => const PrivacyPolicyScreen(),
        AppRoute.termsAndCondition: (context) =>
            const TermsAndConditionScreen(),
      },
      onGenerateRoute: (settings) {
        bool isPrivacy = settings.name?.contains("privacy") ?? false;
        bool isTnC = settings.name?.contains("terms") ?? false;
        if (isPrivacy) {
          return MaterialPageRoute(
            builder: (context) {
              return const PrivacyPolicyScreen();
            },
          );
        } else if (isTnC) {
          return MaterialPageRoute(
            builder: (context) {
              return const TermsAndConditionScreen();
            },
          );
        }
      },
    );
  }
}
