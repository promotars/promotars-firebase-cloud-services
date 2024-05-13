import 'package:flutter/material.dart';
import 'package:promotars_flutter_web_landing_page/utils/responsive.dart';

class AppConfig {
  static const String parentCompanyName = "Promoters Pvt Ltd";
  static const String tabBarText =
      "Promotars - One Stop Solution For Business Growth";
  static Uri get promotarsAndriodAppStoreLink =>
      Uri.parse('https://flutter.dev');
  static Uri get promotarsiOSAppStoreLink => Uri.parse('https://flutter.dev');
  static double contentPadding(BuildContext context) =>
      Sizes(20, 50, 100).responsiveValue(context);

  static const String appName = 'Promotars';
  static const int minAge = 16;
  static const String companyName = 'Promotars Corporation';
  static const String contactEmail = 'promotars.corporation@gmail.com';
}
