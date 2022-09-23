const request = require('request');
const cheerio = require('cheerio');

const URL = 'https://bikes.fan/orbea-vibe-mid-h10-eq-2022/';

request(URL, (err, res, body) => {
  if (err) {
    console.log(err);
  } else {
    let $ = cheerio.load(body);

    let bikeObj = {
      electric: '',
      brand: '',
      model: '',
      year: '',
      image: '',
      price: '',
      category: '',
      wheels: '',
      frame: '',
      suspensionFork: '',
      rearShock: '',
      rearDerailleur: '',
      frontDerailleur: '',
      shiftLevers: '',
      cassette: '',
      crank: '',
      bottomBracket: '',
      chain: '',
      pedals: '',
      chainGuide: '',
      rims: '',
      tires: '',
      frontHub: '',
      rearHub: '',
      spokes: '',
      brakes: '',
      brakeLevers: '',
      diskRotors: '',
      stem: '',
      handlebar: '',
      grips: '',
      headset: '',
      saddle: '',
      seatpost: '',
      motor: '',
      battery: '',
      remote: '',
      charger: '',
      //   chainTensioner: '',
    };

    // rules
    const brandRule = 'h1.article-title.bike-title > span.brand';
    const modelRule = 'h1.article-title.bike-title > span.model';
    const imageRule = 'div.post-thumb-inner > a.image';
    const categoryRule =
      'div.bike-summary > ul > li > div.text > span.desc > ul.bike-categories > li';
    const priceRule = 'div.bike-info > div.bike-price > span.price';
    const currencyRule = 'div.bike-info > div.bike-price > span.currency';

    bikeObj.brand = $(brandRule).text().trim();
    const model = $(modelRule).text().trim();
    bikeObj.model = model.substring(0, model.length - 5);
    bikeObj.year = model.substring(model.length - 4, model.length);
    bikeObj.image = $(imageRule).attr('href');

    if ($(`${categoryRule}:nth-child(1)`).text().trim() === 'E-bike') {
      bikeObj.electric = 'Yes';
      bikeObj.category = $(`${categoryRule}`).text().replace(/\s/g, '');
    } else {
      bikeObj.electric = 'No';
      bikeObj.category = $(`${categoryRule}`).text().replace(/\s/g, '');
    }

    bikeObj.price = $(priceRule).text().trim() + ' ' + $(currencyRule).text();

    const bikeSummaryListLength = $(
      'div.bike-summary > ul > li > div.text'
    ).length;

    for (var i = 1; i <= bikeSummaryListLength; i++) {
      let rule = `div.bike-summary > ul > li:nth-child(${i})`;
      let bikeData = $(`${rule} > div.text > span.desc`).text().trim();

      switch (
        String($(`${rule} > div.text > span.title`).text().trim().toLowerCase())
      ) {
        case 'wheels':
          bikeObj.wheels = bikeData;
          break;

        default:
          //   console.log('affe', String(rule.text().trim().toLowerCase()));
          continue;
      }
    }

    const bikeComponentsRule =
      'div.bike-additional-data > div.container > div.bike-componentes-wrapper > div.bike-components > div.components-group';

    for (var i = 1; i <= $(bikeComponentsRule).length; i++) {
      let bikeComponentGroupRule = `${bikeComponentsRule}:nth-child(${i + 1})`;
      let bikeComponentGroupHeadingRule = `${bikeComponentGroupRule} > h3`;

      let bikeComponentDivRule = `${bikeComponentGroupRule} > div.component`;
      switch (
        String($(bikeComponentGroupHeadingRule).text().trim().toLowerCase())
      ) {
        case 'frame':
          for (var j = 1; j <= $(bikeComponentDivRule).length; j++) {
            let frameData = $(`${bikeComponentDivRule}:nth-child(${j + 1}) > p`)
              .text()
              .trim();
            switch (
              String(
                $(`${bikeComponentDivRule}:nth-child(${j + 1}) > h4`)
                  .text()
                  .trim()
                  .toLowerCase()
              )
            ) {
              case 'frame':
                bikeObj.frame = frameData;
                break;
              case 'suspension fork':
                bikeObj.suspensionFork = frameData;
                break;
              case 'rear shock':
                bikeObj.rearShock = frameData;
                break;
              default:
                continue;
            }
          }
          break;
        case 'drivetrain':
          for (var j = 1; j <= $(bikeComponentDivRule).length; j++) {
            const drivetrainData = $(
              `${bikeComponentDivRule}:nth-child(${j + 1}) > p`
            )
              .text()
              .trim();
            switch (
              String(
                $(`${bikeComponentDivRule}:nth-child(${j + 1}) > h4`)
                  .text()
                  .trim()
                  .toLowerCase()
              )
            ) {
              case 'rear derailleur':
                bikeObj.rearDerailleur = drivetrainData;
                break;
              case 'front derailleur':
                bikeObj.frontDerailleur = drivetrainData;
                break;
              case 'shift levers':
                bikeObj.shiftLevers = drivetrainData;
                break;
              case 'cassette':
                bikeObj.cassette = drivetrainData;
                break;
              case 'crank':
                bikeObj.crank = drivetrainData;
                break;
              case 'bottom bracket':
                bikeObj.bottomBracket = drivetrainData;
                break;
              case 'chain':
                bikeObj.chain = drivetrainData;
                break;
              case 'pedals':
                bikeObj.pedals = drivetrainData;
                break;
              case 'chain guide':
                bikeObj.chainGuide = drivetrainData;
                break;
              default:
                continue;
            }
          }
          break;
        case 'wheels':
          for (var j = 1; j <= $(bikeComponentDivRule).length; j++) {
            const wheelsData = $(
              `${bikeComponentDivRule}:nth-child(${j + 1}) > p`
            )
              .text()
              .trim();
            switch (
              String(
                $(`${bikeComponentDivRule}:nth-child(${j + 1}) > h4`)
                  .text()
                  .trim()
                  .toLowerCase()
              )
            ) {
              case 'rims':
                bikeObj.rims = wheelsData;
                break;
              case 'tires':
                bikeObj.tires = wheelsData;
                break;
              case 'front hub':
                bikeObj.frontHub = wheelsData;
                break;
              case 'rear hub':
                bikeObj.rearHub = wheelsData;
                break;
              case 'spokes':
                bikeObj.spokes = wheelsData;
                break;
              default:
                continue;
            }
          }
          break;
        case 'brakes':
          for (var j = 1; j <= $(bikeComponentDivRule).length; j++) {
            const brakesData = $(
              `${bikeComponentDivRule}:nth-child(${j + 1}) > p`
            )
              .text()
              .trim();
            switch (
              String(
                $(`${bikeComponentDivRule}:nth-child(${j + 1}) > h4`)
                  .text()
                  .trim()
                  .toLowerCase()
              )
            ) {
              case 'brakes':
                bikeObj.brakes = brakesData;
                break;
              case 'brake levers':
                bikeObj.brakeLevers = brakesData;
                break;
              case 'disk rotors':
                bikeObj.diskRotors = brakesData;
                break;
              default:
                continue;
            }
          }
          break;
        case 'cockpit':
          for (var j = 1; j <= $(bikeComponentDivRule).length; j++) {
            const cockpitData = $(
              `${bikeComponentDivRule}:nth-child(${j + 1}) > p`
            )
              .text()
              .trim();
            switch (
              String(
                $(`${bikeComponentDivRule}:nth-child(${j + 1}) > h4`)
                  .text()
                  .trim()
                  .toLowerCase()
              )
            ) {
              case 'stem':
                bikeObj.stem = cockpitData;
                break;
              case 'handlebar':
                bikeObj.handlebar = cockpitData;
                break;
              case 'grips':
                bikeObj.grips = cockpitData;
                break;
              case 'headset':
                bikeObj.headset = cockpitData;
                break;
              default:
                continue;
            }
          }
          break;
        case 'seat':
          for (var j = 1; j <= $(bikeComponentDivRule).length; j++) {
            const seatData = $(
              `${bikeComponentDivRule}:nth-child(${j + 1}) > p`
            )
              .text()
              .trim();
            switch (
              String(
                $(`${bikeComponentDivRule}:nth-child(${j + 1}) > h4`)
                  .text()
                  .trim()
                  .toLowerCase()
              )
            ) {
              case 'saddle':
                bikeObj.saddle = seatData;
                break;
              case 'seatpost':
                bikeObj.seatpost = seatData;
                break;
              default:
                continue;
            }
          }
          break;
        case 'motor & battery':
          for (var j = 1; j <= $(bikeComponentDivRule).length; j++) {
            const motorBatteryData = $(
              `${bikeComponentDivRule}:nth-child(${j + 1}) > p`
            )
              .text()
              .trim();
            switch (
              String(
                $(`${bikeComponentDivRule}:nth-child(${j + 1}) > h4`)
                  .text()
                  .trim()
                  .toLowerCase()
              )
            ) {
              case 'motor':
                bikeObj.motor = motorBatteryData;
                break;
              case 'battery':
                bikeObj.battery = motorBatteryData;
                break;
              case 'remote':
                bikeObj.remote = motorBatteryData;
                break;
              case 'charger':
                bikeObj.charger = motorBatteryData;
                break;
              default:
                continue;
            }
          }
          break;
        default:
          continue;
      }
    }

    console.log(bikeObj);
  }
});
