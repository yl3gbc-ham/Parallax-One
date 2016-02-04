function media_upload(button_class) {

	jQuery('body').on('click', button_class, function(e) {
		var button_id ='#'+jQuery(this).attr('id');
		var display_field = jQuery(this).parent().children('input:text');
		var _custom_media = true;

		wp.media.editor.send.attachment = function(props, attachment){

			if ( _custom_media  ) {
				if(typeof display_field != 'undefined'){
					switch(props.size){
						case 'full':
							display_field.val(attachment.sizes.full.url);
                            display_field.trigger('change');
							break;
						case 'medium':
							display_field.val(attachment.sizes.medium.url);
                            display_field.trigger('change');
							break;
						case 'thumbnail':
							display_field.val(attachment.sizes.thumbnail.url);
                            display_field.trigger('change');
							break;
						case 'parallax_one_team':
							console.log(attachment.sizes);
							display_field.val(attachment.sizes.parallax_one_team.url);
                            display_field.trigger('change');
							break
						case 'parallax_one_services':
							display_field.val(attachment.sizes.parallax_one_services.url);
                            display_field.trigger('change');
							break
						case 'parallax_one_customers':
							display_field.val(attachment.sizes.parallax_one_customers.url);
                            display_field.trigger('change');
							break;
						default:
							display_field.val(attachment.url);
                            display_field.trigger('change');
					}
				}
				_custom_media = false;
			} else {
				return wp.media.editor.send.attachment( button_id, [props, attachment] );
			}
		}
		wp.media.editor.open(button_class);
		window.send_to_editor = function(html) {

		}
		return false;
	});
}

/********************************************
*** Generate uniq id ***
*********************************************/
function parallax_one_uniqid(prefix, more_entropy) {

  if (typeof prefix === 'undefined') {
    prefix = '';
  }

  var retId;
  var formatSeed = function(seed, reqWidth) {
    seed = parseInt(seed, 10)
      .toString(16); // to hex str
    if (reqWidth < seed.length) { // so long we split
      return seed.slice(seed.length - reqWidth);
    }
    if (reqWidth > seed.length) { // so short we pad
      return Array(1 + (reqWidth - seed.length))
        .join('0') + seed;
    }
    return seed;
  };

  // BEGIN REDUNDANT
  if (!this.php_js) {
    this.php_js = {};
  }
  // END REDUNDANT
  if (!this.php_js.uniqidSeed) { // init seed with big random int
    this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
  }
  this.php_js.uniqidSeed++;

  retId = prefix; // start with prefix, add current milliseconds hex string
  retId += formatSeed(parseInt(new Date()
    .getTime() / 1000, 10), 8);
  retId += formatSeed(this.php_js.uniqidSeed, 5); // add seed hex string
  if (more_entropy) {
    // for more entropy we add a float lower to 10
    retId += (Math.random() * 10)
      .toFixed(8)
      .toString();
  }

  return retId;
}


/********************************************
*** General Repeater ***
*********************************************/
function parallax_one_refresh_general_control_values(){
	jQuery(".parallax_one_general_control_repeater").each(function(){
		var values = [];
		var th = jQuery(this);
		th.find(".parallax_one_general_control_repeater_container").each(function(){
			var icon_value = jQuery(this).find('.dd-selected-value').val();
			var text = jQuery(this).find(".parallax_one_text_control").val();
			var link = jQuery(this).find(".parallax_one_link_control").val();
			var image_url = jQuery(this).find(".custom_media_url").val();
			var choice = jQuery(this).find(".parallax_one_image_choice").val();
			var title = jQuery(this).find(".parallax_one_title_control").val();
			var subtitle = jQuery(this).find(".parallax_one_subtitle_control").val();
			var id = jQuery(this).find(".parallax_one_box_id").val();
            var shortcode = jQuery(this).find(".parallax_one_shortcode_control").val();
            if( text !='' || image_url!='' || title!='' || subtitle!='' ){
                values.push({
                    "icon_value" : (choice === 'parallax_none' ? "" : icon_value) ,
                    "text" :  escapeHtml(text),
                    "link" : link,
                    "image_url" : (choice === 'parallax_none' ? "" : image_url),
                    "choice" : choice,
                    "title" : escapeHtml(title),
                    "subtitle" : escapeHtml(subtitle),
					"id" : id,
                    "shortcode" : escapeHtml(shortcode)
                });
            }

        });
        th.find('.parallax_one_repeater_colector').val(JSON.stringify(values));
        th.find('.parallax_one_repeater_colector').trigger('change');
    });
}



jQuery(document).ready(function(){
    jQuery('#customize-theme-controls').on('click','.parallax-customize-control-title',function(){
        jQuery(this).next().slideToggle('medium', function() {
            if (jQuery(this).is(':visible'))
                jQuery(this).css('display','block');
        });
    });

    jQuery('#customize-theme-controls').on('change','.parallax_one_image_choice',function() {
        if(jQuery(this).val() == 'parallax_image'){
            jQuery(this).parent().parent().find('.parallax_one_general_control_icon').hide();
            jQuery(this).parent().parent().find('.parallax_one_image_control').show();
        }
        if(jQuery(this).val() == 'parallax_icon'){
            jQuery(this).parent().parent().find('.parallax_one_general_control_icon').show();
            jQuery(this).parent().parent().find('.parallax_one_image_control').hide();
        }
        if(jQuery(this).val() == 'parallax_none'){
            jQuery(this).parent().parent().find('.parallax_one_general_control_icon').hide();
            jQuery(this).parent().parent().find('.parallax_one_image_control').hide();
        }

        parallax_one_refresh_general_control_values();
        return false;
    });
    media_upload('.custom_media_button_parallax_one');
    jQuery(".custom_media_url").live('change',function(){
        parallax_one_refresh_general_control_values();
        return false;
    });


	jQuery("#customize-theme-controls").on('change', '.dd-selected-value',function(){
		parallax_one_refresh_general_control_values();
		return false;
	});

	jQuery(".parallax_one_general_control_new_field").on("click",function(){

		var th = jQuery(this).parent();
		var id = 'parallax_one_'+parallax_one_uniqid();
		if(typeof th != 'undefined') {

            var field = th.find(".parallax_one_general_control_repeater_container:first").clone();
            if(typeof field != 'undefined'){
                field.find(".parallax_one_image_choice").val('parallax_icon');
                field.find('.parallax_one_general_control_icon').show();

								if(field.find('.parallax_one_general_control_icon').length > 0){
	              	field.find('.parallax_one_image_control').hide();
								}

                field.find(".parallax_one_general_control_remove_field").show();
                //field.find(".parallax_one_icon_control").val('');
								field.find('.dd-container').before('<div class="parallax-dd"><select name="parallax_one_social_icons" class="parallax_one_icon_control"><option value="No Icon" data-iconclass="No Icon">No Icon</option><option value="icon-social-blogger" data-iconclass="icon-social-blogger">icon-social-blogger</option><option value="icon-social-blogger-circle" data-iconclass="icon-social-blogger-circle">icon-social-blogger-circle</option><option value="icon-social-blogger-square" data-iconclass="icon-social-blogger-square">icon-social-blogger-square</option><option value="icon-social-delicious" data-iconclass="icon-social-delicious">icon-social-delicious</option><option value="icon-social-delicious-circle" data-iconclass="icon-social-delicious-circle">icon-social-delicious-circle</option><option value="icon-social-delicious-square" data-iconclass="icon-social-delicious-square">icon-social-delicious-square</option><option value="icon-social-deviantart" data-iconclass="icon-social-deviantart">icon-social-deviantart</option><option value="icon-social-deviantart-circle" data-iconclass="icon-social-deviantart-circle">icon-social-deviantart-circle</option><option value="icon-social-deviantart-square" data-iconclass="icon-social-deviantart-square">icon-social-deviantart-square</option><option value="icon-social-dribbble" data-iconclass="icon-social-dribbble">icon-social-dribbble</option><option value="icon-social-dribbble-circle" data-iconclass="icon-social-dribbble-circle">icon-social-dribbble-circle</option><option value="icon-social-dribbble-square" data-iconclass="icon-social-dribbble-square">icon-social-dribbble-square</option><option value="icon-social-facebook" data-iconclass="icon-social-facebook">icon-social-facebook</option><option value="icon-social-facebook-circle" data-iconclass="icon-social-facebook-circle">icon-social-facebook-circle</option><option value="icon-social-facebook-square" data-iconclass="icon-social-facebook-square">icon-social-facebook-square</option><option value="icon-social-flickr" data-iconclass="icon-social-flickr">icon-social-flickr</option><option value="icon-social-flickr-circle" data-iconclass="icon-social-flickr-circle">icon-social-flickr-circle</option><option value="icon-social-flickr-square" data-iconclass="icon-social-flickr-square">icon-social-flickr-square</option><option value="icon-social-googledrive" data-iconclass="icon-social-googledrive">icon-social-googledrive</option><option value="icon-social-googledrive-alt2" data-iconclass="icon-social-googledrive-alt2">icon-social-googledrive-alt2</option><option value="icon-social-googledrive-square" data-iconclass="icon-social-googledrive-square">icon-social-googledrive-square</option><option value="icon-social-googleplus" data-iconclass="icon-social-googleplus">icon-social-googleplus</option><option value="icon-social-googleplus-circle" data-iconclass="icon-social-googleplus-circle">icon-social-googleplus-circle</option><option value="icon-social-googleplus-square" data-iconclass="icon-social-googleplus-square">icon-social-googleplus-square</option><option value="icon-social-instagram" data-iconclass="icon-social-instagram">icon-social-instagram</option><option value="icon-social-instagram-circle" data-iconclass="icon-social-instagram-circle">icon-social-instagram-circle</option><option value="icon-social-instagram-square" data-iconclass="icon-social-instagram-square">icon-social-instagram-square</option><option value="icon-social-linkedin" data-iconclass="icon-social-linkedin">icon-social-linkedin</option><option value="icon-social-linkedin-circle" data-iconclass="icon-social-linkedin-circle">icon-social-linkedin-circle</option><option value="icon-social-linkedin-square" data-iconclass="icon-social-linkedin-square">icon-social-linkedin-square</option><option value="icon-social-myspace" data-iconclass="icon-social-myspace">icon-social-myspace</option><option value="icon-social-myspace-circle" data-iconclass="icon-social-myspace-circle">icon-social-myspace-circle</option><option value="icon-social-myspace-square" data-iconclass="icon-social-myspace-square">icon-social-myspace-square</option><option value="icon-social-picassa" data-iconclass="icon-social-picassa">icon-social-picassa</option><option value="icon-social-picassa-circle" data-iconclass="icon-social-picassa-circle">icon-social-picassa-circle</option><option value="icon-social-picassa-square" data-iconclass="icon-social-picassa-square">icon-social-picassa-square</option><option value="icon-social-pinterest" data-iconclass="icon-social-pinterest">icon-social-pinterest</option><option value="icon-social-pinterest-circle" data-iconclass="icon-social-pinterest-circle">icon-social-pinterest-circle</option><option value="icon-social-pinterest-square" data-iconclass="icon-social-pinterest-square">icon-social-pinterest-square</option><option value="icon-social-rss" data-iconclass="icon-social-rss">icon-social-rss</option><option value="icon-social-rss-circle" data-iconclass="icon-social-rss-circle">icon-social-rss-circle</option><option value="icon-social-rss-square" data-iconclass="icon-social-rss-square">icon-social-rss-square</option><option value="icon-social-skype" data-iconclass="icon-social-skype">icon-social-skype</option><option value="icon-social-skype-circle" data-iconclass="icon-social-skype-circle">icon-social-skype-circle</option><option value="icon-social-skype-square" data-iconclass="icon-social-skype-square">icon-social-skype-square</option><option value="icon-social-spotify" data-iconclass="icon-social-spotify">icon-social-spotify</option><option value="icon-social-spotify-circle" data-iconclass="icon-social-spotify-circle">icon-social-spotify-circle</option><option value="icon-social-spotify-square" data-iconclass="icon-social-spotify-square">icon-social-spotify-square</option><option value="icon-social-stumbleupon-circle" data-iconclass="icon-social-stumbleupon-circle">icon-social-stumbleupon-circle</option><option value="icon-social-stumbleupon-square" data-iconclass="icon-social-stumbleupon-square">icon-social-stumbleupon-square</option><option value="icon-social-tumbleupon" data-iconclass="icon-social-tumbleupon">icon-social-tumbleupon</option><option value="icon-social-tumblr" data-iconclass="icon-social-tumblr">icon-social-tumblr</option><option value="icon-social-tumblr-circle" data-iconclass="icon-social-tumblr-circle">icon-social-tumblr-circle</option><option value="icon-social-tumblr-square" data-iconclass="icon-social-tumblr-square">icon-social-tumblr-square</option><option value="icon-social-twitter" data-iconclass="icon-social-twitter">icon-social-twitter</option><option value="icon-social-twitter-circle" data-iconclass="icon-social-twitter-circle">icon-social-twitter-circle</option><option value="icon-social-twitter-square" data-iconclass="icon-social-twitter-square">icon-social-twitter-square</option><option value="icon-social-vimeo" data-iconclass="icon-social-vimeo">icon-social-vimeo</option><option value="icon-social-vimeo-circle" data-iconclass="icon-social-vimeo-circle">icon-social-vimeo-circle</option><option value="icon-social-vimeo-square" data-iconclass="icon-social-vimeo-square">icon-social-vimeo-square</option><option value="icon-social-wordpress" data-iconclass="icon-social-wordpress">icon-social-wordpress</option><option value="icon-social-wordpress-circle" data-iconclass="icon-social-wordpress-circle">icon-social-wordpress-circle</option><option value="icon-social-wordpress-square" data-iconclass="icon-social-wordpress-square">icon-social-wordpress-square</option><option value="icon-social-youtube" data-iconclass="icon-social-youtube">icon-social-youtube</option><option value="icon-social-youtube-circle" data-iconclass="icon-social-youtube-circle">icon-social-youtube-circle</option><option value="icon-social-youtube-square" data-iconclass="icon-social-youtube-square">icon-social-youtube-square</option><option value="icon-weather-wind-e" data-iconclass="icon-weather-wind-e">icon-weather-wind-e</option><option value="icon-weather-wind-n" data-iconclass="icon-weather-wind-n">icon-weather-wind-n</option><option value="icon-weather-wind-ne" data-iconclass="icon-weather-wind-ne">icon-weather-wind-ne</option><option value="icon-weather-wind-nw" data-iconclass="icon-weather-wind-nw">icon-weather-wind-nw</option><option value="icon-weather-wind-s" data-iconclass="icon-weather-wind-s">icon-weather-wind-s</option><option value="icon-weather-wind-se" data-iconclass="icon-weather-wind-se">icon-weather-wind-se</option><option value="icon-weather-wind-sw" data-iconclass="icon-weather-wind-sw">icon-weather-wind-sw</option><option value="icon-weather-wind-w" data-iconclass="icon-weather-wind-w">icon-weather-wind-w</option><option value="icon-software-add-vectorpoint" data-iconclass="icon-software-add-vectorpoint">icon-software-add-vectorpoint</option><option value="icon-software-box-oval" data-iconclass="icon-software-box-oval">icon-software-box-oval</option><option value="icon-software-box-polygon" data-iconclass="icon-software-box-polygon">icon-software-box-polygon</option><option value="icon-software-crop" data-iconclass="icon-software-crop">icon-software-crop</option><option value="icon-software-eyedropper" data-iconclass="icon-software-eyedropper">icon-software-eyedropper</option><option value="icon-software-font-allcaps" data-iconclass="icon-software-font-allcaps">icon-software-font-allcaps</option><option value="icon-software-font-kerning" data-iconclass="icon-software-font-kerning">icon-software-font-kerning</option><option value="icon-software-horizontal-align-center" data-iconclass="icon-software-horizontal-align-center">icon-software-horizontal-align-center</option><option value="icon-software-layout" data-iconclass="icon-software-layout">icon-software-layout</option><option value="icon-software-layout-4boxes" data-iconclass="icon-software-layout-4boxes">icon-software-layout-4boxes</option><option value="icon-software-layout-header" data-iconclass="icon-software-layout-header">icon-software-layout-header</option><option value="icon-software-layout-header-2columns" data-iconclass="icon-software-layout-header-2columns">icon-software-layout-header-2columns</option><option value="icon-software-layout-header-3columns" data-iconclass="icon-software-layout-header-3columns">icon-software-layout-header-3columns</option><option value="icon-software-layout-header-4boxes" data-iconclass="icon-software-layout-header-4boxes">icon-software-layout-header-4boxes</option><option value="icon-software-layout-header-4columns" data-iconclass="icon-software-layout-header-4columns">icon-software-layout-header-4columns</option><option value="icon-software-layout-header-complex" data-iconclass="icon-software-layout-header-complex">icon-software-layout-header-complex</option><option value="icon-software-layout-header-complex2" data-iconclass="icon-software-layout-header-complex2">icon-software-layout-header-complex2</option><option value="icon-software-layout-header-complex3" data-iconclass="icon-software-layout-header-complex3">icon-software-layout-header-complex3</option><option value="icon-software-layout-header-complex4" data-iconclass="icon-software-layout-header-complex4">icon-software-layout-header-complex4</option><option value="icon-software-layout-header-sideleft" data-iconclass="icon-software-layout-header-sideleft">icon-software-layout-header-sideleft</option><option value="icon-software-layout-header-sideright" data-iconclass="icon-software-layout-header-sideright">icon-software-layout-header-sideright</option><option value="icon-software-layout-sidebar-left" data-iconclass="icon-software-layout-sidebar-left">icon-software-layout-sidebar-left</option><option value="icon-software-layout-sidebar-right" data-iconclass="icon-software-layout-sidebar-right">icon-software-layout-sidebar-right</option><option value="icon-software-paragraph-align-left" data-iconclass="icon-software-paragraph-align-left">icon-software-paragraph-align-left</option><option value="icon-software-paragraph-align-right" data-iconclass="icon-software-paragraph-align-right">icon-software-paragraph-align-right</option><option value="icon-software-paragraph-center" data-iconclass="icon-software-paragraph-center">icon-software-paragraph-center</option><option value="icon-software-paragraph-justify-all" data-iconclass="icon-software-paragraph-justify-all">icon-software-paragraph-justify-all</option><option value="icon-software-paragraph-justify-center" data-iconclass="icon-software-paragraph-justify-center">icon-software-paragraph-justify-center</option><option value="icon-software-paragraph-justify-left" data-iconclass="icon-software-paragraph-justify-left">icon-software-paragraph-justify-left</option><option value="icon-software-paragraph-justify-right" data-iconclass="icon-software-paragraph-justify-right">icon-software-paragraph-justify-right</option><option value="icon-software-pathfinder-exclude" data-iconclass="icon-software-pathfinder-exclude">icon-software-pathfinder-exclude</option><option value="icon-software-pathfinder-intersect" data-iconclass="icon-software-pathfinder-intersect">icon-software-pathfinder-intersect</option><option value="icon-software-pathfinder-subtract" data-iconclass="icon-software-pathfinder-subtract">icon-software-pathfinder-subtract</option><option value="icon-software-pathfinder-unite" data-iconclass="icon-software-pathfinder-unite">icon-software-pathfinder-unite</option><option value="icon-software-pen" data-iconclass="icon-software-pen">icon-software-pen</option><option value="icon-software-pencil" data-iconclass="icon-software-pencil">icon-software-pencil</option><option value="icon-software-scale-expand" data-iconclass="icon-software-scale-expand">icon-software-scale-expand</option><option value="icon-software-scale-reduce" data-iconclass="icon-software-scale-reduce">icon-software-scale-reduce</option><option value="icon-software-vector-box" data-iconclass="icon-software-vector-box">icon-software-vector-box</option><option value="icon-software-vertical-align-bottom" data-iconclass="icon-software-vertical-align-bottom">icon-software-vertical-align-bottom</option><option value="icon-software-vertical-distribute-bottom" data-iconclass="icon-software-vertical-distribute-bottom">icon-software-vertical-distribute-bottom</option><option value="icon-music-beginning-button" data-iconclass="icon-music-beginning-button">icon-music-beginning-button</option><option value="icon-music-bell" data-iconclass="icon-music-bell">icon-music-bell</option><option value="icon-music-eject-button" data-iconclass="icon-music-eject-button">icon-music-eject-button</option><option value="icon-music-end-button" data-iconclass="icon-music-end-button">icon-music-end-button</option><option value="icon-music-fastforward-button" data-iconclass="icon-music-fastforward-button">icon-music-fastforward-button</option><option value="icon-music-headphones" data-iconclass="icon-music-headphones">icon-music-headphones</option><option value="icon-music-microphone-old" data-iconclass="icon-music-microphone-old">icon-music-microphone-old</option><option value="icon-music-mixer" data-iconclass="icon-music-mixer">icon-music-mixer</option><option value="icon-music-pause-button" data-iconclass="icon-music-pause-button">icon-music-pause-button</option><option value="icon-music-play-button" data-iconclass="icon-music-play-button">icon-music-play-button</option><option value="icon-music-rewind-button" data-iconclass="icon-music-rewind-button">icon-music-rewind-button</option><option value="icon-music-shuffle-button" data-iconclass="icon-music-shuffle-button">icon-music-shuffle-button</option><option value="icon-music-stop-button" data-iconclass="icon-music-stop-button">icon-music-stop-button</option><option value="icon-ecommerce-bag" data-iconclass="icon-ecommerce-bag">icon-ecommerce-bag</option><option value="icon-ecommerce-bag-check" data-iconclass="icon-ecommerce-bag-check">icon-ecommerce-bag-check</option><option value="icon-ecommerce-bag-cloud" data-iconclass="icon-ecommerce-bag-cloud">icon-ecommerce-bag-cloud</option><option value="icon-ecommerce-bag-download" data-iconclass="icon-ecommerce-bag-download">icon-ecommerce-bag-download</option><option value="icon-ecommerce-bag-plus" data-iconclass="icon-ecommerce-bag-plus">icon-ecommerce-bag-plus</option><option value="icon-ecommerce-bag-upload" data-iconclass="icon-ecommerce-bag-upload">icon-ecommerce-bag-upload</option><option value="icon-ecommerce-basket-check" data-iconclass="icon-ecommerce-basket-check">icon-ecommerce-basket-check</option><option value="icon-ecommerce-basket-cloud" data-iconclass="icon-ecommerce-basket-cloud">icon-ecommerce-basket-cloud</option><option value="icon-ecommerce-basket-download" data-iconclass="icon-ecommerce-basket-download">icon-ecommerce-basket-download</option><option value="icon-ecommerce-basket-upload" data-iconclass="icon-ecommerce-basket-upload">icon-ecommerce-basket-upload</option><option value="icon-ecommerce-bath" data-iconclass="icon-ecommerce-bath">icon-ecommerce-bath</option><option value="icon-ecommerce-cart" data-iconclass="icon-ecommerce-cart">icon-ecommerce-cart</option><option value="icon-ecommerce-cart-check" data-iconclass="icon-ecommerce-cart-check">icon-ecommerce-cart-check</option><option value="icon-ecommerce-cart-cloud" data-iconclass="icon-ecommerce-cart-cloud">icon-ecommerce-cart-cloud</option><option value="icon-ecommerce-cart-content" data-iconclass="icon-ecommerce-cart-content">icon-ecommerce-cart-content</option><option value="icon-ecommerce-cart-download" data-iconclass="icon-ecommerce-cart-download">icon-ecommerce-cart-download</option><option value="icon-ecommerce-cart-plus" data-iconclass="icon-ecommerce-cart-plus">icon-ecommerce-cart-plus</option><option value="icon-ecommerce-cart-upload" data-iconclass="icon-ecommerce-cart-upload">icon-ecommerce-cart-upload</option><option value="icon-ecommerce-cent" data-iconclass="icon-ecommerce-cent">icon-ecommerce-cent</option><option value="icon-ecommerce-colon" data-iconclass="icon-ecommerce-colon">icon-ecommerce-colon</option><option value="icon-ecommerce-creditcard" data-iconclass="icon-ecommerce-creditcard">icon-ecommerce-creditcard</option><option value="icon-ecommerce-diamond" data-iconclass="icon-ecommerce-diamond">icon-ecommerce-diamond</option><option value="icon-ecommerce-dollar" data-iconclass="icon-ecommerce-dollar">icon-ecommerce-dollar</option><option value="icon-ecommerce-euro" data-iconclass="icon-ecommerce-euro">icon-ecommerce-euro</option><option value="icon-ecommerce-franc" data-iconclass="icon-ecommerce-franc">icon-ecommerce-franc</option><option value="icon-ecommerce-gift" data-iconclass="icon-ecommerce-gift">icon-ecommerce-gift</option><option value="icon-ecommerce-graph1" data-iconclass="icon-ecommerce-graph1">icon-ecommerce-graph1</option><option value="icon-ecommerce-graph2" data-iconclass="icon-ecommerce-graph2">icon-ecommerce-graph2</option><option value="icon-ecommerce-graph3" data-iconclass="icon-ecommerce-graph3">icon-ecommerce-graph3</option><option value="icon-ecommerce-graph-decrease" data-iconclass="icon-ecommerce-graph-decrease">icon-ecommerce-graph-decrease</option><option value="icon-ecommerce-graph-increase" data-iconclass="icon-ecommerce-graph-increase">icon-ecommerce-graph-increase</option><option value="icon-ecommerce-guarani" data-iconclass="icon-ecommerce-guarani">icon-ecommerce-guarani</option><option value="icon-ecommerce-kips" data-iconclass="icon-ecommerce-kips">icon-ecommerce-kips</option><option value="icon-ecommerce-lira" data-iconclass="icon-ecommerce-lira">icon-ecommerce-lira</option><option value="icon-ecommerce-money" data-iconclass="icon-ecommerce-money">icon-ecommerce-money</option><option value="icon-ecommerce-naira" data-iconclass="icon-ecommerce-naira">icon-ecommerce-naira</option><option value="icon-ecommerce-pesos" data-iconclass="icon-ecommerce-pesos">icon-ecommerce-pesos</option><option value="icon-ecommerce-pound" data-iconclass="icon-ecommerce-pound">icon-ecommerce-pound</option><option value="icon-ecommerce-receipt" data-iconclass="icon-ecommerce-receipt">icon-ecommerce-receipt</option><option value="icon-ecommerce-sale" data-iconclass="icon-ecommerce-sale">icon-ecommerce-sale</option><option value="icon-ecommerce-sales" data-iconclass="icon-ecommerce-sales">icon-ecommerce-sales</option><option value="icon-ecommerce-tugriks" data-iconclass="icon-ecommerce-tugriks">icon-ecommerce-tugriks</option><option value="icon-ecommerce-wallet" data-iconclass="icon-ecommerce-wallet">icon-ecommerce-wallet</option><option value="icon-ecommerce-won" data-iconclass="icon-ecommerce-won">icon-ecommerce-won</option><option value="icon-ecommerce-yen" data-iconclass="icon-ecommerce-yen">icon-ecommerce-yen</option><option value="icon-ecommerce-yen2" data-iconclass="icon-ecommerce-yen2">icon-ecommerce-yen2</option><option value="icon-basic-elaboration-briefcase-check" data-iconclass="icon-basic-elaboration-briefcase-check">icon-basic-elaboration-briefcase-check</option><option value="icon-basic-elaboration-briefcase-download" data-iconclass="icon-basic-elaboration-briefcase-download">icon-basic-elaboration-briefcase-download</option><option value="icon-basic-elaboration-browser-check" data-iconclass="icon-basic-elaboration-browser-check">icon-basic-elaboration-browser-check</option><option value="icon-basic-elaboration-browser-download" data-iconclass="icon-basic-elaboration-browser-download">icon-basic-elaboration-browser-download</option><option value="icon-basic-elaboration-browser-plus" data-iconclass="icon-basic-elaboration-browser-plus">icon-basic-elaboration-browser-plus</option><option value="icon-basic-elaboration-calendar-check" data-iconclass="icon-basic-elaboration-calendar-check">icon-basic-elaboration-calendar-check</option><option value="icon-basic-elaboration-calendar-cloud" data-iconclass="icon-basic-elaboration-calendar-cloud">icon-basic-elaboration-calendar-cloud</option><option value="icon-basic-elaboration-calendar-download" data-iconclass="icon-basic-elaboration-calendar-download">icon-basic-elaboration-calendar-download</option><option value="icon-basic-elaboration-calendar-empty" data-iconclass="icon-basic-elaboration-calendar-empty">icon-basic-elaboration-calendar-empty</option><option value="icon-basic-elaboration-calendar-heart" data-iconclass="icon-basic-elaboration-calendar-heart">icon-basic-elaboration-calendar-heart</option><option value="icon-basic-elaboration-cloud-download" data-iconclass="icon-basic-elaboration-cloud-download">icon-basic-elaboration-cloud-download</option><option value="icon-basic-elaboration-cloud-check" data-iconclass="icon-basic-elaboration-cloud-check">icon-basic-elaboration-cloud-check</option><option value="icon-basic-elaboration-cloud-search" data-iconclass="icon-basic-elaboration-cloud-search">icon-basic-elaboration-cloud-search</option><option value="icon-basic-elaboration-cloud-upload" data-iconclass="icon-basic-elaboration-cloud-upload">icon-basic-elaboration-cloud-upload</option><option value="icon-basic-elaboration-document-check" data-iconclass="icon-basic-elaboration-document-check">icon-basic-elaboration-document-check</option><option value="icon-basic-elaboration-document-graph" data-iconclass="icon-basic-elaboration-document-graph">icon-basic-elaboration-document-graph</option><option value="icon-basic-elaboration-folder-check" data-iconclass="icon-basic-elaboration-folder-check">icon-basic-elaboration-folder-check</option><option value="icon-basic-elaboration-folder-cloud" data-iconclass="icon-basic-elaboration-folder-cloud">icon-basic-elaboration-folder-cloud</option><option value="icon-basic-elaboration-mail-document" data-iconclass="icon-basic-elaboration-mail-document">icon-basic-elaboration-mail-document</option><option value="icon-basic-elaboration-mail-download" data-iconclass="icon-basic-elaboration-mail-download">icon-basic-elaboration-mail-download</option><option value="icon-basic-elaboration-message-check" data-iconclass="icon-basic-elaboration-message-check">icon-basic-elaboration-message-check</option><option value="icon-basic-elaboration-message-dots" data-iconclass="icon-basic-elaboration-message-dots">icon-basic-elaboration-message-dots</option><option value="icon-basic-elaboration-message-happy" data-iconclass="icon-basic-elaboration-message-happy">icon-basic-elaboration-message-happy</option><option value="icon-basic-elaboration-tablet-pencil" data-iconclass="icon-basic-elaboration-tablet-pencil">icon-basic-elaboration-tablet-pencil</option><option value="icon-basic-elaboration-todolist-2" data-iconclass="icon-basic-elaboration-todolist-2">icon-basic-elaboration-todolist-2</option><option value="icon-basic-elaboration-todolist-check" data-iconclass="icon-basic-elaboration-todolist-check">icon-basic-elaboration-todolist-check</option><option value="icon-basic-elaboration-todolist-cloud" data-iconclass="icon-basic-elaboration-todolist-cloud">icon-basic-elaboration-todolist-cloud</option><option value="icon-basic-elaboration-todolist-download" data-iconclass="icon-basic-elaboration-todolist-download">icon-basic-elaboration-todolist-download</option><option value="icon-basic-accelerator" data-iconclass="icon-basic-accelerator">icon-basic-accelerator</option><option value="icon-basic-anticlockwise" data-iconclass="icon-basic-anticlockwise">icon-basic-anticlockwise</option><option value="icon-basic-battery-half" data-iconclass="icon-basic-battery-half">icon-basic-battery-half</option><option value="icon-basic-bolt" data-iconclass="icon-basic-bolt">icon-basic-bolt</option><option value="icon-basic-book" data-iconclass="icon-basic-book">icon-basic-book</option><option value="icon-basic-book-pencil" data-iconclass="icon-basic-book-pencil">icon-basic-book-pencil</option><option value="icon-basic-bookmark" data-iconclass="icon-basic-bookmark">icon-basic-bookmark</option><option value="icon-basic-calendar" data-iconclass="icon-basic-calendar">icon-basic-calendar</option><option value="icon-basic-cards-hearts" data-iconclass="icon-basic-cards-hearts">icon-basic-cards-hearts</option><option value="icon-basic-case" data-iconclass="icon-basic-case">icon-basic-case</option><option value="icon-basic-clessidre" data-iconclass="icon-basic-clessidre">icon-basic-clessidre</option><option value="icon-basic-cloud" data-iconclass="icon-basic-cloud">icon-basic-cloud</option><option value="icon-basic-clubs" data-iconclass="icon-basic-clubs">icon-basic-clubs</option><option value="icon-basic-compass" data-iconclass="icon-basic-compass">icon-basic-compass</option><option value="icon-basic-cup" data-iconclass="icon-basic-cup">icon-basic-cup</option><option value="icon-basic-display" data-iconclass="icon-basic-display">icon-basic-display</option><option value="icon-basic-download" data-iconclass="icon-basic-download">icon-basic-download</option><option value="icon-basic-exclamation" data-iconclass="icon-basic-exclamation">icon-basic-exclamation</option><option value="icon-basic-eye" data-iconclass="icon-basic-eye">icon-basic-eye</option><option value="icon-basic-gear" data-iconclass="icon-basic-gear">icon-basic-gear</option><option value="icon-basic-geolocalize-01" data-iconclass="icon-basic-geolocalize-01">icon-basic-geolocalize-01</option><option value="icon-basic-geolocalize-05" data-iconclass="icon-basic-geolocalize-05">icon-basic-geolocalize-05</option><option value="icon-basic-headset" data-iconclass="icon-basic-headset">icon-basic-headset</option><option value="icon-basic-heart" data-iconclass="icon-basic-heart">icon-basic-heart</option><option value="icon-basic-home" data-iconclass="icon-basic-home">icon-basic-home</option><option value="icon-basic-laptop" data-iconclass="icon-basic-laptop">icon-basic-laptop</option><option value="icon-basic-lightbulb" data-iconclass="icon-basic-lightbulb">icon-basic-lightbulb</option><option value="icon-basic-link" data-iconclass="icon-basic-link">icon-basic-link</option><option value="icon-basic-lock" data-iconclass="icon-basic-lock">icon-basic-lock</option><option value="icon-basic-lock-open" data-iconclass="icon-basic-lock-open">icon-basic-lock-open</option><option value="icon-basic-magnifier" data-iconclass="icon-basic-magnifier">icon-basic-magnifier</option><option value="icon-basic-magnifier-minus" data-iconclass="icon-basic-magnifier-minus">icon-basic-magnifier-minus</option><option value="icon-basic-magnifier-plus" data-iconclass="icon-basic-magnifier-plus">icon-basic-magnifier-plus</option><option value="icon-basic-mail" data-iconclass="icon-basic-mail">icon-basic-mail</option><option value="icon-basic-mail-multiple" data-iconclass="icon-basic-mail-multiple">icon-basic-mail-multiple</option><option value="icon-basic-mail-open-text" data-iconclass="icon-basic-mail-open-text">icon-basic-mail-open-text</option><option value="icon-basic-male" data-iconclass="icon-basic-male">icon-basic-male</option><option value="icon-basic-map" data-iconclass="icon-basic-map">icon-basic-map</option><option value="icon-basic-message" data-iconclass="icon-basic-message">icon-basic-message</option><option value="icon-basic-message-multiple" data-iconclass="icon-basic-message-multiple">icon-basic-message-multiple</option><option value="icon-basic-message-txt" data-iconclass="icon-basic-message-txt">icon-basic-message-txt</option><option value="icon-basic-mixer2" data-iconclass="icon-basic-mixer2">icon-basic-mixer2</option><option value="icon-basic-notebook-pencil" data-iconclass="icon-basic-notebook-pencil">icon-basic-notebook-pencil</option><option value="icon-basic-paperplane" data-iconclass="icon-basic-paperplane">icon-basic-paperplane</option><option value="icon-basic-photo" data-iconclass="icon-basic-photo">icon-basic-photo</option><option value="icon-basic-picture" data-iconclass="icon-basic-picture">icon-basic-picture</option><option value="icon-basic-picture-multiple" data-iconclass="icon-basic-picture-multiple">icon-basic-picture-multiple</option><option value="icon-basic-rss" data-iconclass="icon-basic-rss">icon-basic-rss</option><option value="icon-basic-server2" data-iconclass="icon-basic-server2">icon-basic-server2</option><option value="icon-basic-settings" data-iconclass="icon-basic-settings">icon-basic-settings</option><option value="icon-basic-share" data-iconclass="icon-basic-share">icon-basic-share</option><option value="icon-basic-sheet-multiple" data-iconclass="icon-basic-sheet-multiple">icon-basic-sheet-multiple</option><option value="icon-basic-sheet-pencil" data-iconclass="icon-basic-sheet-pencil">icon-basic-sheet-pencil</option><option value="icon-basic-sheet-txt" data-iconclass="icon-basic-sheet-txt">icon-basic-sheet-txt</option><option value="icon-basic-tablet" data-iconclass="icon-basic-tablet">icon-basic-tablet</option><option value="icon-basic-todo" data-iconclass="icon-basic-todo">icon-basic-todo</option><option value="icon-basic-webpage" data-iconclass="icon-basic-webpage">icon-basic-webpage</option><option value="icon-basic-webpage-img-txt" data-iconclass="icon-basic-webpage-img-txt">icon-basic-webpage-img-txt</option><option value="icon-basic-webpage-multiple" data-iconclass="icon-basic-webpage-multiple">icon-basic-webpage-multiple</option><option value="icon-basic-webpage-txt" data-iconclass="icon-basic-webpage-txt">icon-basic-webpage-txt</option><option value="icon-basic-world" data-iconclass="icon-basic-world">icon-basic-world</option><option value="icon-arrows-check" data-iconclass="icon-arrows-check">icon-arrows-check</option><option value="icon-arrows-circle-check" data-iconclass="icon-arrows-circle-check">icon-arrows-circle-check</option><option value="icon-arrows-circle-down" data-iconclass="icon-arrows-circle-down">icon-arrows-circle-down</option><option value="icon-arrows-circle-downleft" data-iconclass="icon-arrows-circle-downleft">icon-arrows-circle-downleft</option><option value="icon-arrows-circle-downright" data-iconclass="icon-arrows-circle-downright">icon-arrows-circle-downright</option><option value="icon-arrows-circle-left" data-iconclass="icon-arrows-circle-left">icon-arrows-circle-left</option><option value="icon-arrows-circle-minus" data-iconclass="icon-arrows-circle-minus">icon-arrows-circle-minus</option><option value="icon-arrows-circle-plus" data-iconclass="icon-arrows-circle-plus">icon-arrows-circle-plus</option><option value="icon-arrows-circle-remove" data-iconclass="icon-arrows-circle-remove">icon-arrows-circle-remove</option><option value="icon-arrows-circle-right" data-iconclass="icon-arrows-circle-right">icon-arrows-circle-right</option><option value="icon-arrows-circle-up" data-iconclass="icon-arrows-circle-up">icon-arrows-circle-up</option><option value="icon-arrows-circle-upleft" data-iconclass="icon-arrows-circle-upleft">icon-arrows-circle-upleft</option><option value="icon-arrows-circle-upright" data-iconclass="icon-arrows-circle-upright">icon-arrows-circle-upright</option><option value="icon-arrows-clockwise" data-iconclass="icon-arrows-clockwise">icon-arrows-clockwise</option><option value="icon-arrows-clockwise-dashed" data-iconclass="icon-arrows-clockwise-dashed">icon-arrows-clockwise-dashed</option><option value="icon-arrows-down" data-iconclass="icon-arrows-down">icon-arrows-down</option><option value="icon-arrows-down-double-34" data-iconclass="icon-arrows-down-double-34">icon-arrows-down-double-34</option><option value="icon-arrows-downleft" data-iconclass="icon-arrows-downleft">icon-arrows-downleft</option><option value="icon-arrows-downright" data-iconclass="icon-arrows-downright">icon-arrows-downright</option><option value="icon-arrows-expand" data-iconclass="icon-arrows-expand">icon-arrows-expand</option><option value="icon-arrows-glide" data-iconclass="icon-arrows-glide">icon-arrows-glide</option><option value="icon-arrows-glide-horizontal" data-iconclass="icon-arrows-glide-horizontal">icon-arrows-glide-horizontal</option><option value="icon-arrows-glide-vertical" data-iconclass="icon-arrows-glide-vertical">icon-arrows-glide-vertical</option><option value="icon-arrows-keyboard-alt" data-iconclass="icon-arrows-keyboard-alt">icon-arrows-keyboard-alt</option><option value="icon-arrows-keyboard-cmd-29" data-iconclass="icon-arrows-keyboard-cmd-29">icon-arrows-keyboard-cmd-29</option><option value="icon-arrows-left" data-iconclass="icon-arrows-left">icon-arrows-left</option><option value="icon-arrows-left-double-32" data-iconclass="icon-arrows-left-double-32">icon-arrows-left-double-32</option><option value="icon-arrows-move2" data-iconclass="icon-arrows-move2">icon-arrows-move2</option><option value="icon-arrows-remove" data-iconclass="icon-arrows-remove">icon-arrows-remove</option><option value="icon-arrows-right" data-iconclass="icon-arrows-right">icon-arrows-right</option><option value="icon-arrows-right-double-31" data-iconclass="icon-arrows-right-double-31">icon-arrows-right-double-31</option><option value="icon-arrows-rotate" data-iconclass="icon-arrows-rotate">icon-arrows-rotate</option><option value="icon-arrows-plus" data-iconclass="icon-arrows-plus">icon-arrows-plus</option><option value="icon-arrows-shrink" data-iconclass="icon-arrows-shrink">icon-arrows-shrink</option><option value="icon-arrows-slim-left" data-iconclass="icon-arrows-slim-left">icon-arrows-slim-left</option><option value="icon-arrows-slim-left-dashed" data-iconclass="icon-arrows-slim-left-dashed">icon-arrows-slim-left-dashed</option><option value="icon-arrows-slim-right" data-iconclass="icon-arrows-slim-right">icon-arrows-slim-right</option><option value="icon-arrows-slim-right-dashed" data-iconclass="icon-arrows-slim-right-dashed">icon-arrows-slim-right-dashed</option><option value="icon-arrows-squares" data-iconclass="icon-arrows-squares">icon-arrows-squares</option><option value="icon-arrows-up" data-iconclass="icon-arrows-up">icon-arrows-up</option><option value="icon-arrows-up-double-33" data-iconclass="icon-arrows-up-double-33">icon-arrows-up-double-33</option><option value="icon-arrows-upleft" data-iconclass="icon-arrows-upleft">icon-arrows-upleft</option><option value="icon-arrows-upright" data-iconclass="icon-arrows-upright">icon-arrows-upright</option><option value="icon-browser-streamline-window" data-iconclass="icon-browser-streamline-window">icon-browser-streamline-window</option><option value="icon-bubble-comment-streamline-talk" data-iconclass="icon-bubble-comment-streamline-talk">icon-bubble-comment-streamline-talk</option><option value="icon-caddie-shopping-streamline" data-iconclass="icon-caddie-shopping-streamline">icon-caddie-shopping-streamline</option><option value="icon-computer-imac" data-iconclass="icon-computer-imac">icon-computer-imac</option><option value="icon-edit-modify-streamline" data-iconclass="icon-edit-modify-streamline">icon-edit-modify-streamline</option><option value="icon-home-house-streamline" data-iconclass="icon-home-house-streamline">icon-home-house-streamline</option><option value="icon-locker-streamline-unlock" data-iconclass="icon-locker-streamline-unlock">icon-locker-streamline-unlock</option><option value="icon-lock-locker-streamline" data-iconclass="icon-lock-locker-streamline">icon-lock-locker-streamline</option><option value="icon-link-streamline" data-iconclass="icon-link-streamline">icon-link-streamline</option><option value="icon-man-people-streamline-user" data-iconclass="icon-man-people-streamline-user">icon-man-people-streamline-user</option><option value="icon-speech-streamline-talk-user" data-iconclass="icon-speech-streamline-talk-user">icon-speech-streamline-talk-user</option><option value="icon-settings-streamline-2" data-iconclass="icon-settings-streamline-2">icon-settings-streamline-2</option><option value="icon-settings-streamline-1" data-iconclass="icon-settings-streamline-1">icon-settings-streamline-1</option><option value="icon-arrow-carrot-left" data-iconclass="icon-arrow-carrot-left">icon-arrow-carrot-left</option><option value="icon-arrow-carrot-right" data-iconclass="icon-arrow-carrot-right">icon-arrow-carrot-right</option><option value="icon-arrow-carrot-up" data-iconclass="icon-arrow-carrot-up">icon-arrow-carrot-up</option><option value="icon-arrow-carrot-right-alt2" data-iconclass="icon-arrow-carrot-right-alt2">icon-arrow-carrot-right-alt2</option><option value="icon-arrow-carrot-down-alt2" data-iconclass="icon-arrow-carrot-down-alt2">icon-arrow-carrot-down-alt2</option><option value="icon-arrow-carrot-left-alt2" data-iconclass="icon-arrow-carrot-left-alt2">icon-arrow-carrot-left-alt2</option><option value="icon-arrow-carrot-up-alt2" data-iconclass="icon-arrow-carrot-up-alt2">icon-arrow-carrot-up-alt2</option><option value="icon-arrow-carrot-2up" data-iconclass="icon-arrow-carrot-2up">icon-arrow-carrot-2up</option><option value="icon-arrow-carrot-2right-alt2" data-iconclass="icon-arrow-carrot-2right-alt2">icon-arrow-carrot-2right-alt2</option><option value="icon-arrow-carrot-2up-alt2" data-iconclass="icon-arrow-carrot-2up-alt2">icon-arrow-carrot-2up-alt2</option><option value="icon-arrow-carrot-2right" data-iconclass="icon-arrow-carrot-2right">icon-arrow-carrot-2right</option><option value="icon-arrow-carrot-2left-alt2" data-iconclass="icon-arrow-carrot-2left-alt2">icon-arrow-carrot-2left-alt2</option><option value="icon-arrow-carrot-2left" data-iconclass="icon-arrow-carrot-2left">icon-arrow-carrot-2left</option><option value="icon-arrow-carrot-2down-alt2" data-iconclass="icon-arrow-carrot-2down-alt2">icon-arrow-carrot-2down-alt2</option><option value="icon-arrow-carrot-2down" data-iconclass="icon-arrow-carrot-2down">icon-arrow-carrot-2down</option><option value="icon-arrow-carrot-down" data-iconclass="icon-arrow-carrot-down">icon-arrow-carrot-down</option><option value="icon-arrow-left" data-iconclass="icon-arrow-left">icon-arrow-left</option><option value="icon-arrow-right" data-iconclass="icon-arrow-right">icon-arrow-right</option><option value="icon-arrow-triangle-down" data-iconclass="icon-arrow-triangle-down">icon-arrow-triangle-down</option><option value="icon-arrow-triangle-left" data-iconclass="icon-arrow-triangle-left">icon-arrow-triangle-left</option><option value="icon-arrow-triangle-right" data-iconclass="icon-arrow-triangle-right">icon-arrow-triangle-right</option><option value="icon-arrow-triangle-up" data-iconclass="icon-arrow-triangle-up">icon-arrow-triangle-up</option><option value="icon-adjust-vert" data-iconclass="icon-adjust-vert">icon-adjust-vert</option><option value="icon-bag-alt" data-iconclass="icon-bag-alt">icon-bag-alt</option><option value="icon-box-checked" data-iconclass="icon-box-checked">icon-box-checked</option><option value="icon-camera-alt" data-iconclass="icon-camera-alt">icon-camera-alt</option><option value="icon-check" data-iconclass="icon-check">icon-check</option><option value="icon-chat-alt" data-iconclass="icon-chat-alt">icon-chat-alt</option><option value="icon-cart-alt" data-iconclass="icon-cart-alt">icon-cart-alt</option><option value="icon-check-alt2" data-iconclass="icon-check-alt2">icon-check-alt2</option><option value="icon-circle-empty" data-iconclass="icon-circle-empty">icon-circle-empty</option><option value="icon-circle-slelected" data-iconclass="icon-circle-slelected">icon-circle-slelected</option><option value="icon-clock-alt" data-iconclass="icon-clock-alt">icon-clock-alt</option><option value="icon-close-alt2" data-iconclass="icon-close-alt2">icon-close-alt2</option><option value="icon-cloud-download-alt" data-iconclass="icon-cloud-download-alt">icon-cloud-download-alt</option><option value="icon-cloud-upload-alt" data-iconclass="icon-cloud-upload-alt">icon-cloud-upload-alt</option><option value="icon-compass-alt" data-iconclass="icon-compass-alt">icon-compass-alt</option><option value="icon-creditcard" data-iconclass="icon-creditcard">icon-creditcard</option><option value="icon-datareport" data-iconclass="icon-datareport">icon-datareport</option><option value="icon-easel" data-iconclass="icon-easel">icon-easel</option><option value="icon-lightbulb-alt" data-iconclass="icon-lightbulb-alt">icon-lightbulb-alt</option><option value="icon-laptop" data-iconclass="icon-laptop">icon-laptop</option><option value="icon-lock-alt" data-iconclass="icon-lock-alt">icon-lock-alt</option><option value="icon-lock-open-alt" data-iconclass="icon-lock-open-alt">icon-lock-open-alt</option><option value="icon-link" data-iconclass="icon-link">icon-link</option><option value="icon-link-alt" data-iconclass="icon-link-alt">icon-link-alt</option><option value="icon-map-alt" data-iconclass="icon-map-alt">icon-map-alt</option><option value="icon-mail-alt" data-iconclass="icon-mail-alt">icon-mail-alt</option><option value="icon-piechart" data-iconclass="icon-piechart">icon-piechart</option><option value="icon-star-half" data-iconclass="icon-star-half">icon-star-half</option><option value="icon-star-half-alt" data-iconclass="icon-star-half-alt">icon-star-half-alt</option><option value="icon-star-alt" data-iconclass="icon-star-alt">icon-star-alt</option><option value="icon-ribbon-alt" data-iconclass="icon-ribbon-alt">icon-ribbon-alt</option><option value="icon-tools" data-iconclass="icon-tools">icon-tools</option><option value="icon-paperclip" data-iconclass="icon-paperclip">icon-paperclip</option><option value="icon-adjust-horiz" data-iconclass="icon-adjust-horiz">icon-adjust-horiz</option><option value="icon-social-blogger" data-iconclass="icon-social-blogger">icon-social-blogger</option><option value="icon-social-blogger-circle" data-iconclass="icon-social-blogger-circle">icon-social-blogger-circle</option><option value="icon-social-blogger-square" data-iconclass="icon-social-blogger-square">icon-social-blogger-square</option><option value="icon-social-delicious" data-iconclass="icon-social-delicious">icon-social-delicious</option><option value="icon-social-delicious-circle" data-iconclass="icon-social-delicious-circle">icon-social-delicious-circle</option><option value="icon-social-delicious-square" data-iconclass="icon-social-delicious-square">icon-social-delicious-square</option><option value="icon-social-deviantart" data-iconclass="icon-social-deviantart">icon-social-deviantart</option><option value="icon-social-deviantart-circle" data-iconclass="icon-social-deviantart-circle">icon-social-deviantart-circle</option><option value="icon-social-deviantart-square" data-iconclass="icon-social-deviantart-square">icon-social-deviantart-square</option><option value="icon-social-dribbble" data-iconclass="icon-social-dribbble">icon-social-dribbble</option><option value="icon-social-dribbble-circle" data-iconclass="icon-social-dribbble-circle">icon-social-dribbble-circle</option><option value="icon-social-dribbble-square" data-iconclass="icon-social-dribbble-square">icon-social-dribbble-square</option><option value="icon-social-facebook" data-iconclass="icon-social-facebook">icon-social-facebook</option><option value="icon-social-facebook-circle" data-iconclass="icon-social-facebook-circle">icon-social-facebook-circle</option><option value="icon-social-facebook-square" data-iconclass="icon-social-facebook-square">icon-social-facebook-square</option><option value="icon-social-flickr" data-iconclass="icon-social-flickr">icon-social-flickr</option><option value="icon-social-flickr-circle" data-iconclass="icon-social-flickr-circle">icon-social-flickr-circle</option><option value="icon-social-flickr-square" data-iconclass="icon-social-flickr-square">icon-social-flickr-square</option><option value="icon-social-googledrive" data-iconclass="icon-social-googledrive">icon-social-googledrive</option><option value="icon-social-googledrive-alt2" data-iconclass="icon-social-googledrive-alt2">icon-social-googledrive-alt2</option><option value="icon-social-googledrive-square" data-iconclass="icon-social-googledrive-square">icon-social-googledrive-square</option><option value="icon-social-googleplus" data-iconclass="icon-social-googleplus">icon-social-googleplus</option><option value="icon-social-googleplus-circle" data-iconclass="icon-social-googleplus-circle">icon-social-googleplus-circle</option><option value="icon-social-googleplus-square" data-iconclass="icon-social-googleplus-square">icon-social-googleplus-square</option><option value="icon-social-instagram" data-iconclass="icon-social-instagram">icon-social-instagram</option><option value="icon-social-instagram-circle" data-iconclass="icon-social-instagram-circle">icon-social-instagram-circle</option><option value="icon-social-instagram-square" data-iconclass="icon-social-instagram-square">icon-social-instagram-square</option><option value="icon-social-linkedin" data-iconclass="icon-social-linkedin">icon-social-linkedin</option><option value="icon-social-linkedin-circle" data-iconclass="icon-social-linkedin-circle">icon-social-linkedin-circle</option><option value="icon-social-linkedin-square" data-iconclass="icon-social-linkedin-square">icon-social-linkedin-square</option><option value="icon-social-myspace" data-iconclass="icon-social-myspace">icon-social-myspace</option><option value="icon-social-myspace-circle" data-iconclass="icon-social-myspace-circle">icon-social-myspace-circle</option><option value="icon-social-myspace-square" data-iconclass="icon-social-myspace-square">icon-social-myspace-square</option><option value="icon-social-picassa" data-iconclass="icon-social-picassa">icon-social-picassa</option><option value="icon-social-picassa-circle" data-iconclass="icon-social-picassa-circle">icon-social-picassa-circle</option><option value="icon-social-picassa-square" data-iconclass="icon-social-picassa-square">icon-social-picassa-square</option><option value="icon-social-pinterest" data-iconclass="icon-social-pinterest">icon-social-pinterest</option><option value="icon-social-pinterest-circle" data-iconclass="icon-social-pinterest-circle">icon-social-pinterest-circle</option><option value="icon-social-pinterest-square" data-iconclass="icon-social-pinterest-square">icon-social-pinterest-square</option><option value="icon-social-rss" data-iconclass="icon-social-rss">icon-social-rss</option><option value="icon-social-rss-circle" data-iconclass="icon-social-rss-circle">icon-social-rss-circle</option><option value="icon-social-rss-square" data-iconclass="icon-social-rss-square">icon-social-rss-square</option><option value="icon-social-share" data-iconclass="icon-social-share">icon-social-share</option><option value="icon-social-share-circle" data-iconclass="icon-social-share-circle">icon-social-share-circle</option><option value="icon-social-share-square" data-iconclass="icon-social-share-square">icon-social-share-square</option><option value="icon-social-skype" data-iconclass="icon-social-skype">icon-social-skype</option><option value="icon-social-skype-circle" data-iconclass="icon-social-skype-circle">icon-social-skype-circle</option><option value="icon-social-skype-square" data-iconclass="icon-social-skype-square">icon-social-skype-square</option><option value="icon-social-spotify" data-iconclass="icon-social-spotify">icon-social-spotify</option><option value="icon-social-spotify-circle" data-iconclass="icon-social-spotify-circle">icon-social-spotify-circle</option><option value="icon-social-spotify-square" data-iconclass="icon-social-spotify-square">icon-social-spotify-square</option><option value="icon-social-stumbleupon-circle" data-iconclass="icon-social-stumbleupon-circle">icon-social-stumbleupon-circle</option><option value="icon-social-stumbleupon-square" data-iconclass="icon-social-stumbleupon-square">icon-social-stumbleupon-square</option><option value="icon-social-tumbleupon" data-iconclass="icon-social-tumbleupon">icon-social-tumbleupon</option><option value="icon-social-tumblr" data-iconclass="icon-social-tumblr">icon-social-tumblr</option><option value="icon-social-tumblr-circle" data-iconclass="icon-social-tumblr-circle">icon-social-tumblr-circle</option><option value="icon-social-tumblr-square" data-iconclass="icon-social-tumblr-square">icon-social-tumblr-square</option><option value="icon-social-twitter" data-iconclass="icon-social-twitter">icon-social-twitter</option><option value="icon-social-twitter-circle" data-iconclass="icon-social-twitter-circle">icon-social-twitter-circle</option><option value="icon-social-twitter-square" data-iconclass="icon-social-twitter-square">icon-social-twitter-square</option><option value="icon-social-vimeo" data-iconclass="icon-social-vimeo">icon-social-vimeo</option><option value="icon-social-vimeo-circle" data-iconclass="icon-social-vimeo-circle">icon-social-vimeo-circle</option><option value="icon-social-vimeo-square" data-iconclass="icon-social-vimeo-square">icon-social-vimeo-square</option><option value="icon-social-wordpress" data-iconclass="icon-social-wordpress">icon-social-wordpress</option><option value="icon-social-wordpress-circle" data-iconclass="icon-social-wordpress-circle">icon-social-wordpress-circle</option><option value="icon-social-wordpress-square" data-iconclass="icon-social-wordpress-square">icon-social-wordpress-square</option><option value="icon-social-youtube" data-iconclass="icon-social-youtube">icon-social-youtube</option><option value="icon-social-youtube-circle" data-iconclass="icon-social-youtube-circle">icon-social-youtube-circle</option><option value="icon-social-youtube-square" data-iconclass="icon-social-youtube-square">icon-social-youtube-square</option><option value="icon-aim" data-iconclass="icon-aim">icon-aim</option><option value="icon-aim-alt" data-iconclass="icon-aim-alt">icon-aim-alt</option><option value="icon-amazon" data-iconclass="icon-amazon">icon-amazon</option><option value="icon-app-store" data-iconclass="icon-app-store">icon-app-store</option><option value="icon-apple" data-iconclass="icon-apple">icon-apple</option><option value="icon-behance" data-iconclass="icon-behance">icon-behance</option><option value="icon-creative-commons" data-iconclass="icon-creative-commons">icon-creative-commons</option><option value="icon-dropbox" data-iconclass="icon-dropbox">icon-dropbox</option><option value="icon-digg" data-iconclass="icon-digg">icon-digg</option><option value="icon-last" data-iconclass="icon-last">icon-last</option><option value="icon-paypal" data-iconclass="icon-paypal">icon-paypal</option><option value="icon-rss" data-iconclass="icon-rss">icon-rss</option><option value="icon-sharethis" data-iconclass="icon-sharethis">icon-sharethis</option><option value="icon-skype" data-iconclass="icon-skype">icon-skype</option><option value="icon-squarespace" data-iconclass="icon-squarespace">icon-squarespace</option><option value="icon-technorati" data-iconclass="icon-technorati">icon-technorati</option><option value="icon-whatsapp" data-iconclass="icon-whatsapp">icon-whatsapp</option><option value="icon-windows" data-iconclass="icon-windows">icon-windows</option><option value="icon-reddit" data-iconclass="icon-reddit">icon-reddit</option><option value="icon-foursquare" data-iconclass="icon-foursquare">icon-foursquare</option><option value="icon-soundcloud" data-iconclass="icon-soundcloud">icon-soundcloud</option><option value="icon-w3" data-iconclass="icon-w3">icon-w3</option><option value="icon-wikipedia" data-iconclass="icon-wikipedia">icon-wikipedia</option><option value="icon-grid-2x2" data-iconclass="icon-grid-2x2">icon-grid-2x2</option><option value="icon-grid-3x3" data-iconclass="icon-grid-3x3">icon-grid-3x3</option><option value="icon-menu-square-alt" data-iconclass="icon-menu-square-alt">icon-menu-square-alt</option><option value="icon-menu" data-iconclass="icon-menu">icon-menu</option><option value="icon-cloud-alt" data-iconclass="icon-cloud-alt">icon-cloud-alt</option><option value="icon-tags-alt" data-iconclass="icon-tags-alt">icon-tags-alt</option><option value="icon-tag-alt" data-iconclass="icon-tag-alt">icon-tag-alt</option><option value="icon-gift-alt" data-iconclass="icon-gift-alt">icon-gift-alt</option><option value="icon-comment-alt" data-iconclass="icon-comment-alt">icon-comment-alt</option><option value="icon-icon-phone" data-iconclass="icon-icon-phone">icon-icon-phone</option><option value="icon-icon-mobile" data-iconclass="icon-icon-mobile">icon-icon-mobile</option><option value="icon-icon-house-alt" data-iconclass="icon-icon-house-alt">icon-icon-house-alt</option><option value="icon-icon-house" data-iconclass="icon-icon-house">icon-icon-house</option><option value="icon-icon-desktop" data-iconclass="icon-icon-desktop">icon-icon-desktop</option></select></div>');
								field.find('.dd-container').remove();
								field.find('.parallax-dd').ddslick({
                  onSelected: function(selectedData){
                  }
                });
                field.find(".parallax_one_text_control").val('');
                field.find(".parallax_one_link_control").val('');
								field.find(".parallax_one_box_id").val(id);
                field.find(".custom_media_url").val('');
                field.find(".parallax_one_title_control").val('');
                field.find(".parallax_one_subtitle_control").val('');
                field.find(".parallax_one_shortcode_control").val('');
                th.find(".parallax_one_general_control_repeater_container:first").parent().append(field);
                parallax_one_refresh_general_control_values();
            }

		}
		return false;
	 });

	jQuery("#customize-theme-controls").on("click", ".parallax_one_general_control_remove_field",function(){
		if( typeof	jQuery(this).parent() != 'undefined'){
			jQuery(this).parent().parent().remove();
			parallax_one_refresh_general_control_values();
		}
		return false;
	});


	jQuery("#customize-theme-controls").on('keyup', '.parallax_one_title_control',function(){
		 parallax_one_refresh_general_control_values();
	});

	jQuery("#customize-theme-controls").on('keyup', '.parallax_one_subtitle_control',function(){
		 parallax_one_refresh_general_control_values();
	});

    jQuery("#customize-theme-controls").on('keyup', '.parallax_one_shortcode_control',function(){
		 parallax_one_refresh_general_control_values();
	});

	jQuery("#customize-theme-controls").on('keyup', '.parallax_one_text_control',function(){
		 parallax_one_refresh_general_control_values();
	});

	jQuery("#customize-theme-controls").on('keyup', '.parallax_one_link_control',function(){
		parallax_one_refresh_general_control_values();
	});

	/*Drag and drop to change icons order*/

	jQuery(".parallax_one_general_control_droppable").sortable({
		update: function( event, ui ) {
			parallax_one_refresh_general_control_values();
		}
	});

});

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;',
  };

  function escapeHtml(string) {
	  string = String(string).replace(new RegExp('\r?\n','g'), '<br />');
	  string = String(string).replace(/\\/g,'&#92;');
	  return String(string).replace(/[&<>"'\/]/g, function (s) {
      	return entityMap[s];
	  });

  }
/********************************************
*** Parallax effect
*********************************************/

jQuery(document).ready(function(){

	jQuery('.parallax-dd').ddslick({
		onSelected: function(selectedData){
			//callback function: do something with selectedData;
		}
	});

	var sh = jQuery('#customize-control-paralax_one_enable_move').find('input:checkbox');
	if(!sh.is(':checked')){
		jQuery('#customize-control-paralax_one_first_layer').hide();
		jQuery('#customize-control-paralax_one_second_layer').hide();
		jQuery('#customize-control-header_image').show();
	} else {
		jQuery('#customize-control-paralax_one_first_layer').show();
		jQuery('#customize-control-paralax_one_second_layer').show();
		jQuery('#customize-control-header_image').hide();
	}

	sh.on('change',function(){
		if(jQuery(this).is(':checked')){
			jQuery('#customize-control-paralax_one_first_layer').fadeIn();
			jQuery('#customize-control-paralax_one_second_layer').fadeIn();
			jQuery('#customize-control-header_image').fadeOut();
		} else {
			jQuery('#customize-control-paralax_one_first_layer').fadeOut();
			jQuery('#customize-control-paralax_one_second_layer').fadeOut();
			jQuery('#customize-control-header_image').fadeIn();
		}
	});
});

jQuery(document).ready(function() {

	var parallax_one_aboutpage = parallaxOneCustomizerObject.aboutpage;
    var parallax_one_nr_actions_required = parallaxOneCustomizerObject.nr_actions_required;

    /* Number of required actions */
    if ((typeof parallax_one_aboutpage !== 'undefined') && (typeof parallax_one_nr_actions_required !== 'undefined') && (parallax_one_nr_actions_required != '0')) {
        jQuery('#accordion-section-themes .accordion-section-title').append('<a href="' + parallax_one_aboutpage + '"><span class="parallax-one-actions-count">' + parallax_one_nr_actions_required + '</span></a>');
    }

    /* Upsells in customizer (Documentation link, Support link, View theme info and Upgrade to PRO link */
	if( !jQuery( ".parallax-upsells" ).length ) {
		jQuery('#customize-theme-controls > ul').prepend('<li class="accordion-section parallax-upsells">');
	}

	if( jQuery( ".parallax-upsells" ).length ) {

		jQuery('.parallax-upsells').append('<a style="width: 80%; margin: 5px auto 5px auto; display: block; text-align: center;" href="http://themeisle.com/documentation-parallax-one/" class="button" target="_blank">{documentation}</a>'.replace('{documentation}', parallaxOneCustomizerObject.documentation));
		jQuery('.parallax-upsells').append('<a style="width: 80%; margin: 5px auto 5px auto; display: block; text-align: center;" href="http://themeisle.com/forums/forum/parallax-one/" class="button" target="_blank">{github}</a>'.replace('{github}', parallaxOneCustomizerObject.support));

	}
	jQuery('.preview-notice').append('<a class="parallax-one-upgrade-to-pro-button" href="http://themeisle.com/plugins/parallax-one-plus/" class="button" target="_blank">{pro}</a>'.replace('{pro}',parallaxOneCustomizerObject.pro));

	if ( !jQuery( ".parallax-upsells" ).length ) {
		jQuery('#customize-theme-controls > ul').prepend('</li>');
	}
});


/********************************************
*** Alpha Opacity
*********************************************/

jQuery(document).ready(function($) {

	Color.prototype.toString = function(remove_alpha) {
		if (remove_alpha == 'no-alpha') {
			return this.toCSS('rgba', '1').replace(/\s+/g, '');
		}
		if (this._alpha < 1) {
			return this.toCSS('rgba', this._alpha).replace(/\s+/g, '');
		}
		var hex = parseInt(this._color, 10).toString(16);
		if (this.error) return '';
		if (hex.length < 6) {
			for (var i = 6 - hex.length - 1; i >= 0; i--) {
				hex = '0' + hex;
			}
		}
		return '#' + hex;
	};

	  $('.pluto-color-control').each(function() {
		var $control = $(this),
			value = $control.val().replace(/\s+/g, '');
		// Manage Palettes
		var palette_input = $control.attr('data-palette');
		if (palette_input == 'false' || palette_input == false) {
			var palette = false;
		} else if (palette_input == 'true' || palette_input == true) {
			var palette = true;
		} else {
			var palette = $control.attr('data-palette').split(",");
		}
		$control.wpColorPicker({ // change some things with the color picker
			 clear: function(event, ui) {
			// TODO reset Alpha Slider to 100
			 },
			change: function(event, ui) {
				// send ajax request to wp.customizer to enable Save & Publish button
				var _new_value = $control.val();
				var key = $control.attr('data-customize-setting-link');
				wp.customize(key, function(obj) {
					obj.set(_new_value);
				});
				// change the background color of our transparency container whenever a color is updated
				var $transparency = $control.parents('.wp-picker-container:first').find('.transparency');
				// we only want to show the color at 100% alpha
				$transparency.css('backgroundColor', ui.color.toString('no-alpha'));
			},
			palettes: palette // remove the color palettes
		});
		$('<div class="parallax-one-alpha-container"><div class="slider-alpha"></div><div class="transparency"></div></div>').appendTo($control.parents('.wp-picker-container'));
		var $alpha_slider = $control.parents('.wp-picker-container:first').find('.slider-alpha');
		// if in format RGBA - grab A channel value
		if (value.match(/rgba\(\d+\,\d+\,\d+\,([^\)]+)\)/)) {
			var alpha_val = parseFloat(value.match(/rgba\(\d+\,\d+\,\d+\,([^\)]+)\)/)[1]) * 100;
			var alpha_val = parseInt(alpha_val);
		} else {
			var alpha_val = 100;
		}
		$alpha_slider.slider({
			slide: function(event, ui) {
				$(this).find('.ui-slider-handle').text(ui.value); // show value on slider handle
				// send ajax request to wp.customizer to enable Save & Publish button
				var _new_value = $control.val();
				var key = $control.attr('data-customize-setting-link');
				wp.customize(key, function(obj) {
					obj.set(_new_value);
				});
			},
			create: function(event, ui) {
				var v = $(this).slider('value');
				$(this).find('.ui-slider-handle').text(v);
			},
			value: alpha_val,
			range: "max",
			step: 1,
			min: 1,
			max: 100
		}); // slider
		$alpha_slider.slider().on('slidechange', function(event, ui) {
			var new_alpha_val = parseFloat(ui.value),
				iris = $control.data('a8cIris'),
				color_picker = $control.data('wpWpColorPicker');
			iris._color._alpha = new_alpha_val / 100.0;
			$control.val(iris._color.toString());
			color_picker.toggler.css({
				backgroundColor: $control.val()
			});
			// fix relationship between alpha slider and the 'side slider not updating.
			var get_val = $control.val();
			$($control).wpColorPicker('color', get_val);
		});
	});


});
