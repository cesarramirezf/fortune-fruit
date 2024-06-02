function CMenu() {
  var _bUpdate;
  var _iTimeElaps;

  var _oStart;
  var _oCreditsBut;

  var _fRequestFullScreen = null;
  var _fCancelFullScreen = null;
  var _oBg;
  var _oAudioToggle;
  var _oButFullscreen;
  var _oLogo;

  var _pStartPosPlay;
  var _pStartPosAudio;
  var _pStartPosCredits;
  var _pStartPosFullscreen;
  var _pStartPosLogo;

  this._init = function () {
    _bUpdate = false;
    _iTimeElaps = 0;

    _oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_menu"));
    s_oStage.addChild(_oBg);

    var oSpriteLogo = s_oSpriteLibrary.getSprite("logo_menu");
    _pStartPosLogo = { x: CANVAS_WIDTH / 2, y: 40 };
    _oLogo = createBitmap(oSpriteLogo);
    _oLogo.x = _pStartPosLogo.x;
    _oLogo.y = _pStartPosLogo.y;
    _oLogo.regX = oSpriteLogo.width / 2;
    s_oStage.addChild(_oLogo);

    var oSpriteStart = s_oSpriteLibrary.getSprite("but_play");
    _pStartPosPlay = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - oSpriteStart.height / 2 - 10,
    };
    _oStart = new CGfxButton(CANVAS_WIDTH / 2, 875, oSpriteStart, s_oStage);
    _oStart.addEventListener(ON_MOUSE_UP, this._onStart, this, 0);

    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      var oSprite = s_oSpriteLibrary.getSprite("audio_icon");
      _pStartPosAudio = {
        x: CANVAS_WIDTH - oSprite.width / 4 - 10,
        y: oSprite.height / 2 + 10,
      };

      _oAudioToggle = new CToggle(
        _pStartPosAudio.x,
        _pStartPosAudio.y,
        oSprite,
        s_bAudioActive
      );
      _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
    }

    var oSprite = s_oSpriteLibrary.getSprite("but_credits");
    _pStartPosCredits = {
      x: oSprite.width / 2 + 10,
      y: oSprite.height / 2 + 10,
    };
    _oCreditsBut = new CGfxButton(
      _pStartPosCredits.x,
      _pStartPosCredits.y,
      oSprite,
      s_oStage
    );
    _oCreditsBut.addEventListener(ON_MOUSE_UP, this._onCreditsBut, this);

    var doc = window.document;
    var docEl = doc.documentElement;
    _fRequestFullScreen =
      docEl.requestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.webkitRequestFullScreen ||
      docEl.msRequestFullscreen;
    _fCancelFullScreen =
      doc.exitFullscreen ||
      doc.mozCancelFullScreen ||
      doc.webkitExitFullscreen ||
      doc.msExitFullscreen;

    if (ENABLE_FULLSCREEN === false) {
      _fRequestFullScreen = false;
    }

    if (_fRequestFullScreen && screenfull.isEnabled) {
      oSprite = s_oSpriteLibrary.getSprite("but_fullscreen");
      _pStartPosFullscreen = {
        x: _pStartPosCredits.x + oSprite.width / 2 + 10,
        y: oSprite.height / 2 + 10,
      };
      _oButFullscreen = new CToggle(
        _pStartPosFullscreen.x,
        _pStartPosFullscreen.y,
        oSprite,
        s_bFullscreen,
        s_oStage
      );
      _oButFullscreen.addEventListener(
        ON_MOUSE_UP,
        this._onFullscreenRelease,
        this
      );
    }

    this.refreshButtonPos();

    _bUpdate = true;
  };

  this.unload = function () {
    _bUpdate = false;
    _oStart.unload();
    _oCreditsBut.unload();

    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      _oAudioToggle.unload();
      _oAudioToggle = null;
    }

    if (_fRequestFullScreen && screenfull.isEnabled) {
      _oButFullscreen.unload();
    }

    s_oMenu = null;
    s_oStage.removeAllChildren();
  };

  this.refreshButtonPos = function () {
    if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
      _oAudioToggle.setPosition(
        _pStartPosAudio.x - s_iOffsetX,
        s_iOffsetY + _pStartPosAudio.y
      );
    }

    if (_fRequestFullScreen && screenfull.isEnabled) {
      _oButFullscreen.setPosition(
        _pStartPosFullscreen.x + s_iOffsetX,
        _pStartPosFullscreen.y + s_iOffsetY
      );
    }

    _oCreditsBut.setPosition(
      _pStartPosCredits.x + s_iOffsetX,
      s_iOffsetY + _pStartPosCredits.y
    );

    if (s_bLandscape) {
      _oLogo.y = _pStartPosLogo.y + s_iOffsetY;
      _oLogo.scale = 0.6;
      _oStart.setPosition(
        _pStartPosPlay.x - s_iOffsetX,
        _pStartPosPlay.y - s_iOffsetY
      );
      _oStart.setScale(0.8);
    } else {
      _oLogo.scale = 1;
      _oLogo.y = _pStartPosLogo.y + s_iOffsetY + 100;
      _oStart.setPosition(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 650);
      _oStart.setScale(1);
    }
  };

  this._onStart = function () {
    $(s_oMain).trigger("start_session");
    s_oMenu.unload();
    s_oMain.gotoGame();
  };

  this._onAudioToggle = function () {
    Howler.mute(s_bAudioActive);
    s_bAudioActive = !s_bAudioActive;
  };

  this._onCreditsBut = function () {
    var oSprite = s_oSpriteLibrary.getSprite("msg_box");
    new CCreditsPanel(
      {
        type: createjs.Ease.bounceOut,
        time: 1000,
        property: { y: CANVAS_HEIGHT / 2 },
      },
      {
        type: createjs.Ease.backIn,
        time: 400,
        property: { y: -oSprite.height / 2 },
      }
    );
  };

  this.resetFullscreenBut = function () {
    if (_fRequestFullScreen && screenfull.isEnabled) {
      _oButFullscreen.setActive(s_bFullscreen);
    }
  };

  this._onFullscreenRelease = function () {
    if (s_bFullscreen) {
      _fCancelFullScreen.call(window.document);
    } else {
      _fRequestFullScreen.call(window.document.documentElement);
    }

    sizeHandler();
  };

  s_oMenu = this;
  this._init();
}

var s_oMenu = null;
