import 'package:flutter/material.dart';
import 'package:promotars_flutter_web_landing_page/components/download_app_btn.dart';
import 'package:promotars_flutter_web_landing_page/screens/web_template.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_colors.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_config.dart';
import 'package:promotars_flutter_web_landing_page/utils/app_style.dart';
import 'package:promotars_flutter_web_landing_page/utils/image_path.dart';
import 'package:promotars_flutter_web_landing_page/utils/responsive.dart';

class WhatsInItContentModel {
  final String title;
  final String subtitle;
  final String image;
  WhatsInItContentModel(
      {required this.image, required this.title, required this.subtitle});
}

class Home extends StatelessWidget {
  const Home({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    String newLine = Responsive.isDesktop(context) ?  "\n" : " ";
    final double webContentHeight =
        Sizes(290, 390, 550).responsiveValue(context);
    return WebTemplate(child: [
      Container(
        height: webContentHeight + (Responsive.isLarge(context) ? 0 : 60),
        width: double.infinity,
        padding: EdgeInsets.symmetric(horizontal: AppConfig.contentPadding(context)),
        child:  Center(
          child: Row(
            mainAxisSize: MainAxisSize.max,
            children: [
              Expanded(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Title(text: "One Stop Solution${newLine}For Business Growth"),
                    SizedBox(height: Sizes(10, 20, 30).responsiveValue(context)),
                    SubTitle(
                        text:
                            "We help business owners increase their revenue. Our team${newLine}of unique specialist can help you achieve your business goals.",),
                    SizedBox(height: Sizes(20, 20, 30).responsiveValue(context)),
                    const DownloadAppButton(
                      text: "Download Now",
                      invertColor: true,
                    ),
                  ],
                ),
              ),
              SizedBox(width: Sizes(10, 20, 30).responsiveValue(context)),
              const IllustrationImage(path: ImagePath.illustration1),
            ],
          ),
        ),
      ),
      Container(
        height: webContentHeight + (Responsive.isLarge(context) ? 0 : 40),
        color: AppColors.primary,
        width: double.infinity,
        padding: EdgeInsets.symmetric(horizontal: AppConfig.contentPadding(context)),
        child: Center(
          child: Row(
            mainAxisSize: MainAxisSize.max,
            children: [
              Expanded(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                     Title(text: "Promote Your${newLine}Business", invertColor: true),
                    SizedBox(height: Sizes(10, 20, 30).responsiveValue(context)),
                     SubTitle(
                      text:
                          "Our specialized mobile app helps you to promote${newLine}your business on your desired platforms by enabling${newLine}promoters from various platforms, bring there audience to your business",
                      invertColor: true,
                    ),
                    SizedBox(height: Sizes(20, 20, 30).responsiveValue(context)),
                    const DownloadAppButton(text: "Try Now"),
                  ],
                ),
              ),
              SizedBox(width: Sizes(10, 20, 30).responsiveValue(context)),
              const IllustrationImage(path: ImagePath.socialMedia),
            ],
          ),
        ),
      ),
      Container(
        height: webContentHeight + (Responsive.isMobile(context) ? 180 : Responsive.isMedium(context) ? 55 : 0),
        width: double.infinity,
        padding: EdgeInsets.symmetric(horizontal: AppConfig.contentPadding(context)),
        child: const Center(
          child: WhatsInIt(),
        ),
      ),
    ]);
  }
}

class IllustrationImage extends StatelessWidget {
  const IllustrationImage({
    required this.path,
  });

  final String path;

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      path,
      height: Sizes(150, 250, 400).responsiveValue(context),
    );
  }
}

class SubTitle extends StatelessWidget {
  const SubTitle({
    super.key,
    required this.text,
    this.invertColor = false,
  });
  final bool invertColor;

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: AppStyle.p1(context).copyWith(
        color: invertColor ? AppColors.white : AppColors.black,
      ),
    );
  }
}

class Title extends StatelessWidget {
  const Title({
    super.key,
    required this.text,
    this.invertColor = false,
  });
  final bool invertColor;
  final String text;
  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: AppStyle.h1(context).copyWith(
        color: invertColor ? AppColors.white : AppColors.black,
      ),
    );
  }
}

class WhatsInIt extends StatefulWidget {
  const WhatsInIt({
    super.key,
  });

  @override
  State<WhatsInIt> createState() => _WhatsInItState();
}

class _WhatsInItState extends State<WhatsInIt>
    with SingleTickerProviderStateMixin {
  late TabController controller = TabController(length: 2, vsync: this);
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        SizedBox(height: Sizes(20, 25, 50).responsiveValue(context)),
        Text(
          "What's in it for you",
          style: AppStyle.h1(context),
        ),
        SizedBox(height: Sizes(5, 5, 10).responsiveValue(context)),
        SizedBox(
          // height: 50,
          width: 200,
          child: TabBar(
            controller: controller,
            tabs: const [
              Tab(text: "Business"),
              Tab(text: "Promoters"),
            ],
          ),
        ),
        SizedBox(height: Sizes(25, 25, 25).responsiveValue(context)),
        Expanded(
          child: TabBarView(
            controller: controller,
            children: [
              WhatsInItContent(
                data: [
                  WhatsInItContentModel(
                    image: ImagePath.socialMedia,
                    title: "Affordable Promotions",
                    subtitle:
                        "No more latent prices and shocked reactions after seeing the final promotion cost. We're here with the most affordable promotions for all",
                  ),
                  WhatsInItContentModel(
                    image: ImagePath.socialMedia,
                    title: "Targeted Leads",
                    subtitle:
                        "Target your audience based on your business state or city in various platform of your requirement",
                  ),
                  WhatsInItContentModel(
                    image: ImagePath.socialMedia,
                    title: "Authentic Views",
                    subtitle:
                        "Our robust system keeps bots at bay and make sure all your promotion generate useful leads",
                  ),
                ],
              ),
              WhatsInItContent(
                data: [
                  WhatsInItContentModel(
                    image: ImagePath.socialMedia,
                    title: "Earn As You Promote",
                    subtitle:
                        "Earn on every unique click you bring from your social network audience to the app",
                  ),
                  WhatsInItContentModel(
                    image: ImagePath.socialMedia,
                    title: "Redeemable Earnings",
                    subtitle:
                        "What’s the use of getting paid when you can't withdraw money when you want to? Earnings can be transferred from wallet to your bank account at your ease",
                  ),
                  WhatsInItContentModel(
                    image: ImagePath.socialMedia,
                    title: "Easy Onboarding",
                    subtitle: "Onboard to the app in few clicks",
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class WhatsInItContent extends StatelessWidget {
  const WhatsInItContent({
    super.key,
    required this.data,
  });

  final List<WhatsInItContentModel> data;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.max,
        children: List.generate(
          data.length,
          (index) {
            return Expanded(
              child: Container(
              margin: EdgeInsets.symmetric(horizontal: Sizes(10, 15, 20).responsiveValue(context),),
                child: Column(
                  mainAxisSize: MainAxisSize.max,
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: [
                    Image.asset(
                      data[index].image,
                      width: Sizes(80, 120, 200).responsiveValue(context),
                    ),
                     SizedBox(height: Sizes(10,15,20).responsiveValue(context),),
                    Text(
                      data[index].title,
                      style: AppStyle.h4(context).copyWith(fontWeight: FontWeight.normal),
                      textAlign: TextAlign.center,
                    ),
                     SizedBox(height: Sizes(10,15,20).responsiveValue(context),),
                    Text(
                      data[index].subtitle,
                      style: AppStyle.p1(context).copyWith(),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
