import {
  Banner,
  Image,
  InlineLayout,
  Text,
  View,
  reactExtension,
  useSettings
} from '@shopify/ui-extensions-react/checkout';
import { useEffect, useState } from 'react';

export default reactExtension(
  'purchase.checkout.block.render',
  () => <Extension />,
);

function Extension() {
  const [timerText, setTimerText] = useState('');
  const {sub_title, star_img, banner_title, timer_minutes, bannerStatus} = useSettings();

  let timeInSecs;
  let ticker;
  let timerMinute = 10;
  if(timer_minutes){
    timerMinute = Number(timer_minutes);
  }
  function tick() {
    var secs = timeInSecs;
    if (secs > 0) {
      timeInSecs--;
    } else {
      clearInterval(ticker);
      startTimer(timerMinute * 60); // 5 minutes in seconds
    }

    var mins = Math.floor(secs / 60);
    secs %= 60;
    var pretty = ((mins < 10) ? "0" : "") + mins + ":" + ((secs < 10) ? "0" : "") + secs;

    setTimerText(pretty);
  }

  function startTimer(secs) {
    timeInSecs = parseInt(secs);
    ticker = setInterval(tick, 1000);
  }

  useEffect(() => {
    startTimer(timerMinute * 60);
    return () => clearInterval(ticker); // Cleanup the interval on component unmount
  }, []);


  return (
    <>
      <InlineLayout columns={['auto', 20]} padding={["base", "none"]} blockAlignment="center">
        <View padding={["none","extraTight", "none", "none"]}>
          <Text size="large">{sub_title ? sub_title : 'This popular product is in high demand'}</Text>
        </View>
        <View padding="none">
          <Image source={`${star_img ? star_img : "https://cdn.shopify.com/s/files/1/0695/9828/2041/files/star-icon.svg?v=1702019480"}`} fit="contain"/>
        </View>
      </InlineLayout>
      <Banner status={bannerStatus ? bannerStatus : 'success'} title={`${banner_title ? banner_title : 'We will reserve your order for'} ${timerText} minutes.`}></Banner>
    </>
  );
}