import { useEffect } from 'react';

const SMARTSUPP_KEY = 'b173326add6fbcc43818e283ada308c8a21905b0';

export default function SmartsuppChatWidget() {
  useEffect(() => {
    if (window.smartsupp) return;
    window._smartsupp = window._smartsupp || {};
    window._smartsupp.key = SMARTSUPP_KEY;
    (function(d) {
      var s, c, o = window.smartsupp = function() { o._.push(arguments); };
      o._ = [];
      s = d.getElementsByTagName('script')[0];
      c = d.createElement('script');
      c.type = 'text/javascript';
      c.charset = 'utf-8';
      c.async = true;
      c.src = 'https://www.smartsuppchat.com/loader.js?';
      s.parentNode.insertBefore(c, s);
    })(document);
  }, []);

  // Do not render noscript or any fallback branding
  return null;
}
