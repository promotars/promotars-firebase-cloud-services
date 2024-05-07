import 'package:flutter/material.dart';

// We will modify it once we have our final design

class Responsive extends StatelessWidget {
  final Widget mobile;
  final Widget? mobileLarge;
  final Widget? tablet;
  final Widget desktop;

  const Responsive({
    Key? key,
    required this.mobile,
    this.tablet,
    required this.desktop,
    this.mobileLarge,
  }) : super(key: key);

  static bool isMobile(BuildContext context) =>
      MediaQuery.of(context).size.width <= 500;

  static bool isMobileLarge(BuildContext context) =>
      MediaQuery.of(context).size.width <= 700;

  static bool isTablet(BuildContext context) =>
      MediaQuery.of(context).size.width < 1024;

  static bool isDesktop(BuildContext context) =>
      MediaQuery.of(context).size.width >= 1024;

  // this is for right section so width would be 80% of total width

  //  1277.5999755859375 > 1277 --- 3
  //  1037.5999755859375 - > 620 < 1277 --- 2
  //  620 - 2 <  --- 1

  static bool isSmall(BuildContext context) =>
      MediaQuery.of(context).size.width < 700;

  static bool isMedium(BuildContext context) =>
      MediaQuery.of(context).size.width >= 700 &&
      MediaQuery.of(context).size.width < 1220;

  static bool isLarge(BuildContext context) =>
      MediaQuery.of(context).size.width >= 1220;

  static double itemsPerRow(BuildContext context) {
    //
    // if (Responsive.isDesktop(context) &&
    //      Responsive.isTablet(context) &&
    //      Responsive.isMobileLarge(context) &&
    //      Responsive.isMobile(context))
    //   return 3;
    // else if ( Responsive.isDesktop(context) &&
    //     Responsive.isTablet(context) &&
    //      Responsive.isMobileLarge(context) &&
    //      Responsive.isMobile(context))
    //   return 3;
    // else if ( Responsive.isDesktop(context) &&
    //      Responsive.isTablet(context) &&
    //     Responsive.isMobileLarge(context) &&
    //      Responsive.isMobile(context))
    //   return 2;
    // else if ( Responsive.isDesktop(context) &&
    //      Responsive.isTablet(context) &&
    //      Responsive.isMobileLarge(context) &&
    //     Responsive.isMobile(context))
    //   return 1;
    // else
    //   return 1;

    if (Responsive.isSmall(context)) {
      return 1;
    }
    if (Responsive.isMedium(context)) {
      return 2;
    }
    if (Responsive.isLarge(context)) {
      return 3;
    } else {
      return 3;
    }
  }

  @override
  Widget build(BuildContext context) {
    final Size _size = MediaQuery.of(context).size;
    if (_size.width >= 1024) {
      return desktop;
    } else if (_size.width >= 700 && tablet != null) {
      return tablet!;
    } else if (_size.width >= 500 && mobileLarge != null) {
      return mobileLarge!;
    } else {
      return mobile;
    }
  }
}


class Sizes{
  final double mobile;
  final double tablet;
  final double web;
  Sizes(this.mobile, this.tablet, this.web);

  double responsiveValue(BuildContext context){
    return Responsive.isDesktop(context) ? web : Responsive.isMedium(context) ? tablet : mobile;
  }
}