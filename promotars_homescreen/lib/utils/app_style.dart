import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:promotars_flutter_web_landing_page/utils/responsive.dart';

class AppStyle {
  static TextStyle h1(context) => GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: Sizes(20, 30, 50).responsiveValue(context));

  // static TextStyle h2 = GoogleFonts.poppins(fontWeight: FontWeight.bold, fontSize: 22);

  // static TextStyle h3 = GoogleFonts.poppins(fontWeight: FontWeight.w700, fontSize: 20);

  static TextStyle h4(context) => GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: Sizes(12, 15, 18).responsiveValue(context));

  // static TextStyle h5 = GoogleFonts.poppins(fontWeight: FontWeight.w700, fontSize: 16);

  // static TextStyle h6 = GoogleFonts.poppins(fontWeight: FontWeight.w600, fontSize: 14);
  
  static TextStyle p1(context) => GoogleFonts.poppins(fontSize: Sizes(10, 12, 14).responsiveValue(context));

  // static TextStyle p1Bold = GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w600);

  // static TextStyle p2 = GoogleFonts.poppins(fontSize: 12);

  // static TextStyle p2Bold = GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600);
}
