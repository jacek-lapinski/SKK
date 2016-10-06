//Famax 5.0 - http://www.codehandling.com/2015/03/famax-40-complete-facebook-fanpage.html
//Buy at http://codecanyon.net/item/famax-facebook-fan-page-on-your-website/10287995
var famaxLoggedInUser = {};
(function ($) {
	var famaxRefreshTimer;
	//get fanpage posts from Facebook
	var getPagePosts = function ($famaxContainer,nextPageApiUrl) {
		//console.log('inside getPlaylistVideos');
		//var pageTokenUrl = "";
		var loadMoreFlag = false;
		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		if(null==famax_global_options.fanPageId) {
			return;
		}
		
		if(null==nextPageApiUrl) {
			apiUrl = "https://graph.facebook.com/v2.4/"+famax_global_options.fanPageId+"/posts?limit="+famax_global_options.maxResults+"&access_token="+famax_global_options.accessToken+"&fields=type,message,object_id,picture,name,description,link,from,comments.limit(1).summary(true),likes.limit(1).summary(true),shares,created_time";
		} else {
			apiUrl = nextPageApiUrl;
			loadMoreFlag = true;
		}
		
		//console.log('getPageFeeds apiUrl-'+apiUrl);
		
		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { insertPageFeeds(response,false,loadMoreFlag,$famaxContainer);},
			error: function(errorResponse) {  alert(errorResponse); },
			beforeSend: setHeader
		});
	},
	
	//get page tags
	getPageTags = function ($famaxContainer,nextPageApiUrl) {
		//console.log('inside getPlaylistVideos');
		//var pageTokenUrl = "";
		var loadMoreFlag = false;
		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		if(null==famax_global_options.fanPageId) {
			return;
		}
		
		if(null==nextPageApiUrl) {
			apiUrl = "https://graph.facebook.com/v2.4/"+famax_global_options.fanPageId+"/tagged?limit="+((famax_global_options.maxResults<10)?10:famax_global_options.maxResults)+"&access_token="+famax_global_options.accessToken+"&fields=type,message,object_id,picture,name,description,link,from,comments.limit(1).summary(true),likes.limit(1).summary(true),shares";
		} else {
			apiUrl = nextPageApiUrl;
			loadMoreFlag = true;
		}
		
		//console.log('getPageFeeds apiUrl-'+apiUrl);
		
		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { insertPageFeeds(response,true,loadMoreFlag,$famaxContainer);},
			error: function(errorResponse) {  alert(errorResponse); },
			beforeSend: setHeader
		});
	},
	

	//get user details from Facebook
	getUserDetails = function (userIdArray,$famaxContainer,metric) {
		//console.log('inside getPlaylistVideos');
		//var pageTokenUrl = "";
		var famax_global_options = $famaxContainer.data('famax_global_options');
		
		if(null==userIdArray || userIdArray.length==0) {
			return;
		}
		
		apiUrl = "https://graph.facebook.com/v2.4/?ids="+userIdArray+"&access_token="+famax_global_options.accessToken+"&fields=id,picture";
		//console.log('getVideoDetails apiUrl-'+apiUrl);
		//console.log('videoIdArray -'+videoIdArray.length);
		
		
		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { insertUserDetails(response,userIdArray,$famaxContainer,metric);},
			error: function(errorResponse) {  alert(errorResponse); },
			beforeSend: setHeader
		});
	},
	

	//get comment feeds from Facebook
	getCommentFeeds = function (itemId,$famaxContainer,nextPageApiUrl) {
		//console.log('inside getPlaylistVideos');
		//var pageTokenUrl = "";
		var loadMoreFlag = false;
		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		if(null==famax_global_options.fanPageId) {
			return;
		}
		
		if(null==nextPageApiUrl) {
			apiUrl = "https://graph.facebook.com/v2.5/"+itemId+"/comments?access_token="+famax_global_options.accessToken+"&limit="+famax_global_options.maxComments;
		} else {
			apiUrl = nextPageApiUrl;
			loadMoreFlag = true;
		}
		
		//console.log('getCommentFeeds apiUrl-'+apiUrl);
		
		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { insertCommentFeeds(response,itemId,loadMoreFlag,$famaxContainer);},
			error: function(errorResponse) {  alert(errorResponse); },
			beforeSend: setHeader
		});
	},	

	//get like feeds from Facebook
	getLikeFeeds = function (itemId,$famaxContainer,nextPageApiUrl) {
		//console.log('inside getPlaylistVideos');
		//var pageTokenUrl = "";
		var loadMoreFlag = false;
		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		if(null==famax_global_options.fanPageId) {
			return;
		}
		
		if(null==nextPageApiUrl) {
			apiUrl = "https://graph.facebook.com/v2.4/"+itemId+"/likes?access_token="+famax_global_options.accessToken+"&limit="+famax_global_options.maxComments+"&fields=name";
		} else {
			apiUrl = nextPageApiUrl;
			loadMoreFlag = true;
		}
		
		//console.log('getCommentFeeds apiUrl-'+apiUrl);
		
		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { insertLikeFeeds(response,itemId,loadMoreFlag,$famaxContainer);},
			error: function(errorResponse) {  alert(errorResponse); },
			beforeSend: setHeader
		});
	},	

	
	
	/* Groups will be added in 5.0
	//get group feeds from Facebook
	getGroupFeeds = function (action,object,$famaxContainer,nextPageApiUrl) {
		//console.log('inside getPlaylistVideos');
		//var pageTokenUrl = "";
		var loadMoreFlag = false;
		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		if(null==famax_global_options.fanPageId) {
			return;
		}
		
		if(null==nextPageApiUrl) {
			apiUrl = "https://graph.facebook.com/v2.4/"+object+"/"+action+"?limit="+famax_global_options.maxResults+"&access_token="+famax_global_options.accessToken+"&fields=type,message,object_id,picture,name,description,link,from";
		} else {
			apiUrl = nextPageApiUrl;
			loadMoreFlag = true;
		}
		
		//console.log('getPageFeeds apiUrl-'+apiUrl);
		
		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { insertPageFeeds(response,action,loadMoreFlag,$famaxContainer);},
			error: function(errorResponse) {  alert(errorResponse); },
			beforeSend: setHeader
		});
	},*/
	
	//get Image attachments
	getAttachments = function (postIdArray,$famaxContainer) {
		//console.log('inside getPlaylistVideos');
		//var pageTokenUrl = "";
		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		if(null==famax_global_options.fanPageId) {
			return;
		}
		
		if(null==postIdArray || postIdArray.length==0) {
			return;
		}
		
		apiUrl = "https://graph.facebook.com/v2.4/?ids="+postIdArray+"&access_token="+famax_global_options.accessToken+"&fields=id,attachments,type,object_id,picture";
		//console.log('getAttachments apiUrl-'+apiUrl);
		
		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { insertAttachments(response,postIdArray,$famaxContainer);},
			error: function(errorResponse) {  alert(errorResponse); },
			beforeSend: setHeader
		});
	},	

	//get Album Cover Photos
	getAlbumCoverPhotos = function (coverPhotoIdArray,$famaxContainer) {
		//console.log('inside getPlaylistVideos');
		//var pageTokenUrl = "";
		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		if(null==famax_global_options.fanPageId) {
			return;
		}
		
		if(null==coverPhotoIdArray || coverPhotoIdArray.length==0) {
			return;
		}
		
		apiUrl = "https://graph.facebook.com/v2.4/?ids="+coverPhotoIdArray+"&access_token="+famax_global_options.accessToken+"&fields=id,images";
		//console.log('getAlbumCoverPhotos apiUrl-'+apiUrl);
		
		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { insertAlbumCoverPhotos(response,coverPhotoIdArray,$famaxContainer);},
			error: function(errorResponse) {  alert(errorResponse); },
			beforeSend: setHeader
		});
	},	
	
	
	//get Video Details
	getVideoDetails = function (videoIdArray,$famaxContainer) {
		//console.log('inside getPlaylistVideos');
		//var pageTokenUrl = "";
		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		if(null==famax_global_options.fanPageId) {
			return;
		}
		
		if(null==videoIdArray || videoIdArray.length==0) {
			return;
		}
		
		apiUrl = "https://graph.facebook.com/v2.4/?ids="+videoIdArray+"&access_token="+famax_global_options.accessToken+"&fields=id,length,format";
		//console.log('getVideoDetails apiUrl-'+apiUrl);
		//console.log('videoIdArray -'+videoIdArray.length);
		
		
		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { insertVideoDetails(response,videoIdArray,$famaxContainer);},
			error: function(errorResponse) {  alert(errorResponse); },
			beforeSend: setHeader
		});
	},	
	
	//get photos from album
	getAlbumPhotos = function (albumId,$famaxContainer,nextPageApiUrl) {
		//console.log('inside getPlaylistVideos');
		//var pageTokenUrl = "";
		var loadMoreFlag = false;
		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		
		if(null==nextPageApiUrl) {
			apiUrl = "https://graph.facebook.com/v2.4/"+albumId+"/photos?limit="+famax_global_options.maxResults+"&access_token="+famax_global_options.accessToken+"&fields=id,images,link,name,picture,source,comments.limit(1).summary(true),likes.limit(1).summary(true),shares";
		} else {
			apiUrl = nextPageApiUrl;
			loadMoreFlag = true;
		}
		
		//console.log('getPageFeeds apiUrl-'+apiUrl);
		
		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { /*insertPhotoFeeds(response,loadMoreFlag,$famaxContainer);*/alert("jacek2")},
			error: function(errorResponse) {  alert(errorResponse); },
			beforeSend: setHeader
		});
	},
	
	
	//get videos of a Fan Page
	getPageVideos = function ($famaxContainer,nextPageApiUrl) {
		//console.log('inside getPlaylistVideos');
		//var pageTokenUrl = "";
		var loadMoreFlag = false;
		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		
		if(null==nextPageApiUrl) {
			apiUrl = "https://graph.facebook.com/v2.4/"+famax_global_options.fanPageId+"/videos/uploaded?limit="+famax_global_options.maxResults+"&access_token="+famax_global_options.accessToken+"&fields=id,description,embed_html,picture,length,source,status,link,thumbnails,format,comments.limit(1).summary(true),likes.limit(1).summary(true),shares";
		} else {
			apiUrl = nextPageApiUrl;
			loadMoreFlag = true;
		}
		
		//console.log('getPageFeeds apiUrl-'+apiUrl);
		
		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { insertVideoFeeds(response,loadMoreFlag,$famaxContainer);},
			error: function(errorResponse) {  alert(errorResponse); },
			beforeSend: setHeader
		});
	},

	//get photos of a Fan Page
	getPagePhotos = function ($famaxContainer,nextPageApiUrl) {
		//console.log('inside getPlaylistVideos');
		//var pageTokenUrl = "";
		var loadMoreFlag = false;
		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		
		if(null==nextPageApiUrl) {
			apiUrl = "https://graph.facebook.com/v2.4/"+famax_global_options.fanPageId+"/photos/uploaded?limit="+famax_global_options.maxResults+"&access_token="+famax_global_options.accessToken+"&fields=id,images,link,name,picture,source,comments.limit(1).summary(true),likes.limit(1).summary(true),shares";
			//"&fields=id,description,embed_html,name,picture,length,source,status,link,thumbnails,format,comments.limit(1).summary(true),likes.limit(1).summary(true),shares";
		} else {
			apiUrl = nextPageApiUrl;
			loadMoreFlag = true;
		}
		
		//console.log('getPagePhotos apiUrl-'+apiUrl);
		
		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { insertPhotoFeeds(response,loadMoreFlag,$famaxContainer);},
			error: function(errorResponse) {  alert(errorResponse); },
			beforeSend: setHeader
		});
	},
	
	
	
	//get albums of a Fan page
	getPageAlbums = function ($famaxContainer,nextPageApiUrl) {
		//console.log('inside getPlaylistVideos');
		//var pageTokenUrl = "";
		var loadMoreFlag = false;
		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		
		if(null==nextPageApiUrl) {
			apiUrl = "https://graph.facebook.com/v2.4/"+famax_global_options.fanPageId+"/albums?limit="+famax_global_options.maxResults+"&access_token="+famax_global_options.accessToken+"&fields=id,name,cover_photo,count,link";
		} else {
			apiUrl = nextPageApiUrl;
			loadMoreFlag = true;
		}
		
		//console.log('getPageFeeds apiUrl-'+apiUrl);
		
		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { insertAlbumFeeds(response,loadMoreFlag,$famaxContainer);},
			error: function(errorResponse) {  alert(errorResponse); },
			beforeSend: setHeader
		});
	},
	

	
	//initialize famax - add necessary HTML code
	initFamax = function($famaxContainer) {
	
		var famax_global_options = $famaxContainer.data('famax_global_options');

		//list
		$famaxContainer.append('<div id="famax-video-list-div"><ul id="tiles"></ul></div>');
		

		//4.0 added - show photos of albums from Albums Tab
		if(famax_global_options.onClickAction=="popup") {
			$famaxContainer.find('#famax-video-list-div').on('click','li[id^="photos_"]',function(){
				//$famaxContainer.data('famax_current_playlist_id',this.id);
				//var albumName = $(this).find('.famax-video-list-title').text();
				//$famaxContainer.data('famax_current_playlist_name',albumName);
				displayTabFeeds(this.id,$famaxContainer);
			});
		}
		
		//4.0 added - Show comments
		$famaxContainer.find('#famax-video-list-div').on('click','.famax-show-comments',function(){
			itemId = $(this).parents('li').first().attr('id');
			displayComments(itemId,$famaxContainer);
		});
		
		//4.0 added - Show Likes
		$famaxContainer.find('#famax-video-list-div').on('click','.famax-show-likes',function(){
			itemId = $(this).parents('li').first().attr('id');
			displayLikes(itemId,$famaxContainer);
		});
		
		var tabId = 'albums';
		displayTabFeeds(tabId,$famaxContainer);

		//added in 5.0
		$famaxContainer.on('click','.famax-hover-icon',function(){
			return true;			
		});
				
	
	},

	//load more comments functionality
	loadMoreComments = function($famaxContainer) {
		var $famaxLoadMoreCommentsDiv = $famaxContainer.find('.famax-encloser-button.famax-more-comments-button');
		$famaxLoadMoreCommentsDiv.text('Loading...');
		$famaxLoadMoreCommentsDiv.addClass('famax-load-more-comments-clicked');
		var nextPageApiUrl = $famaxLoadMoreCommentsDiv.data('nextpageapiurl');
		//console.log('load more clicked : nextPageToken-'+nextPageToken);
		if(null!=nextPageApiUrl && nextPageApiUrl!="undefined" && nextPageApiUrl!="") {
			getCommentFeeds(null,$famaxContainer,nextPageApiUrl);
		} else {
			$famaxLoadMoreCommentsDiv.text('All Done');
		}
	},
		
	
	//load more button likes functionality
	loadMoreLikes = function($famaxContainer) {
		var $famaxLoadMoreLikesDiv = $famaxContainer.find('.famax-encloser-button.famax-more-likes-button');
		$famaxLoadMoreLikesDiv.text('Loading...');
		$famaxLoadMoreLikesDiv.addClass('famax-load-more-likes-clicked');
		var nextPageApiUrl = $famaxLoadMoreLikesDiv.data('nextpageapiurl');
		if(null!=nextPageApiUrl && nextPageApiUrl!="undefined" && nextPageApiUrl!="") {
			getLikeFeeds(null,$famaxContainer,nextPageApiUrl);
		} else {
			$famaxLoadMoreLikesDiv.text('All Done');
		}
	},
	
	
	//get Fan Page details
	getPageDetails = function ($famaxContainer) {
		//console.log('inside getChannelDetails');
		var famax_global_options = $famaxContainer.data('famax_global_options');
		if(null==famax_global_options.fanPageId) {
			return;
		}
		
		apiUrl = "https://graph.facebook.com/v2.4/"+famax_global_options.fanPageId+"?access_token="+famax_global_options.accessToken+"&fields=talking_about_count,cover,likes,name";
		//console.log('apiUrl-'+apiUrl);
		//showLoader();
		
		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { displayPageHeader(response,$famaxContainer);},
			error: function(html) { alert(html); },
			beforeSend: setHeader
		});
	},
	
	/*TODO: Groups will be added in 4.0
	//get Group details
	getGroupDetails = function ($famaxContainer) {
		//console.log('inside getGroupDetails');
		var famax_global_options = $famaxContainer.data('famax_global_options');
		if(null==famax_global_options.fanPageId) {
			return;
		}
		
		apiUrl = "https://graph.facebook.com/v2.4/"+famax_global_options.fanPageId+"?access_token="+famax_global_options.accessToken;
		//console.log('apiUrl-'+apiUrl);
		//showLoader();
		
		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { displayGroupHeader(response,$famaxContainer);},
			error: function(html) { alert(html); },
			beforeSend: setHeader
		});
	},*/
	
	/* not needed as of now
	//get icon for page
	getPageIcon = function ($famaxContainer) {
		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		if(null==famax_global_options.fanPageId) {
			return;
		}
		
		apiUrl = "https://graph.facebook.com/v2.4/"+famax_global_options.fanPageId+"/picture?redirect=false";

		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { 
				//console.log(response);
				$famaxContainer.find('.famax-channel-icon img').attr('src',response.data.url);
			},
			error: function(html) { alert(html); },
			beforeSend: setHeader
		});
	},*/

	setHeader = function (xhr) {
		if(xhr && xhr.overrideMimeType) {
			xhr.overrideMimeType("application/j-son;charset=UTF-8");
		}
	},
	
	//utility function to displaye view counts
	convertViewCount = function(videoViewCount) {
		videoViewCount = parseInt(videoViewCount,10);
		if(videoViewCount<1000) {
			
		} else if (videoViewCount<1000000) {
			videoViewCount = Math.round(videoViewCount/1000) + "K";
			
		} else if (videoViewCount<1000000000) {
			videoViewCount = (videoViewCount/1000000).toFixed(1) + "M";
		} else {
			videoViewCount = (videoViewCount/1000000000).toFixed(1) + "B";
		}
		
		return videoViewCount;
		
	},
	
	handleComments = function(thisElement,$famaxContainer) {
		
		$(thisElement).text('posting..').attr('disabled','disabled');
		var famax_global_options = $famaxContainer.data('famax_global_options');

		var famaxUserAccessToken = famaxLoggedInUser.famaxUserAccessToken;
		if(null!=famaxUserAccessToken && famaxUserAccessToken!="") {
			//Token available
			//getLoggedInUserDetails($famaxContainer,youmaxAccessToken,youmax_global_options.apiKey);
			
			var comment = $famaxContainer.find('.famax-comment-textbox').val();
			if(null==comment||comment.trim()=="") {
				alert("Please enter a valid comment..");
				$famaxContainer.find('.famax-add-comment-button').removeAttr('disabled').text('POST');
				return;
			} else {
				comment=comment.trim();
			}
			
			var postId = $famaxContainer.find('.famax-encloser-button.famax-more-comments-button').data('postid');			
			famaxPostComment($famaxContainer,postId,famaxUserAccessToken,comment);
			
		} else {
			//Initiate Login Workflow
			//console.log('Initiate Login Workflow');
			famaxLoginToFacebook();
		
		}
	
	},
	
	handleLikes = function(thisElement,$famaxContainer) {
		
		$(thisElement).text('processing..').attr('disabled','disabled');
		var famax_global_options = $famaxContainer.data('famax_global_options');

		var famaxUserAccessToken = famaxLoggedInUser.famaxUserAccessToken;
		if(null!=famaxUserAccessToken && famaxUserAccessToken!="") {
			//Token available
			var postId = $famaxContainer.find('.famax-encloser-button.famax-more-likes-button').data('postid');			
			famaxPostLike($famaxContainer,postId,famaxUserAccessToken);
			
		} else {
			//Initiate Login Workflow
			//console.log('Initiate Login Workflow');
			famaxLoginToFacebook();
		
		}
	
	},
	
	famaxLoginToFacebook = function() {
	
		FB.login(function(response) {
			//console.log('Fb login');
			//console.log(response);
			if (response.status === 'connected') {
				// Logged into your app and Facebook.
				famaxLoggedInUser.famaxUserAccessToken = response.authResponse.accessToken;
				//console.log("Temporary Access Token : "+famaxLoggedInUser.famaxUserAccessToken);
				saveUserName();
				$('.famax-add-comment-button').removeAttr('disabled').html('<i class="fa fa-facebook-square fa-lg"></i>&nbsp; POST');
				$('.famax-add-like-button').removeAttr('disabled').html('<i class="fa fa-facebook-square fa-lg"></i>&nbsp; LIKE');
			} else if (response.status === 'not_authorized') {
				// The person is logged into Facebook, but not your app.
				//console.log('Please log into this app');
			} else {
				// The person is not logged into Facebook, so we're not sure if
				// they are logged into this app or not.
				//console.log('Please log into Facebook');
			}
		}, {scope: 'publish_actions'});

	},
	
	saveUserName = function() {
		//console.log('Welcome!  Fetching your information.... ');
		FB.api('/me', function(response) {
			//console.log('Got user details ');
			//console.log(response);
			famaxLoggedInUser.name = response.name;
			famaxLoggedInUser.id = response.id;
		});
		FB.api('/me/picture', function(response) {
			//console.log('Got user photo ');
			//console.log(response);
			famaxLoggedInUser.picture = response.data.url;
			//$('.'+famaxLoggedInUser.id).css('background-image','url("'+famaxLoggedInUser.picture+'"');
		});
	},

	
	famaxPostComment = function($famaxContainer,postId,famaxUserAccessToken,comment) {
		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		//postId="182162001806727_900228793333374";
		var postCommentURL = "https://graph.facebook.com/v2.4/"+postId+"/comments";
		
		//console.log();
		$.ajax({
			url: postCommentURL,
			type: 'post',
			crossDomain: true,
			data: { message:comment, access_token:famaxUserAccessToken },
			//contentType: "application/atom+xml",
			beforeSend: function(xhr){
				//xhr.setRequestHeader('X-GData-Key','key='+apiKey);
				//xhr.setRequestHeader('Authorization','Bearer '+youmaxAccessToken);
				//xhr.setRequestHeader('GData-Version','2');
				//xhr.setRequestHeader('Host','gdata.youtube.com');
				xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				//xhr.setRequestHeader('Content-Length',xmlComment.length);
			},
			success: function (data, status) {				
				
				//var famax_global_options = $famaxContainer.data('famax_global_options');			
				
				$famaxContainer.find('#famax-encloser-comments').prepend('<div class="famax-video-comment '+famaxLoggedInUser.id+'"><div class="famax-comment-from"><div class="famax-comment-from-img" style="background-image:url(\''+famaxLoggedInUser.picture+'\');"></div><div class="famax-comment-from-name">'+famaxLoggedInUser.name+'</div><div class="famax-published">just now</div></div><div class="famax-comment"><span class="famax-comment-content">'+comment+'</span><div></div>');
			
				//getUserDetails(new Array(fromId),$famaxContainer,'comment');
				
				$famaxContainer.find('.famax-add-comment-button').removeAttr('disabled').html('<i class="fa fa-facebook-square fa-lg"></i>&nbsp; POST');
				$famaxContainer.find('.famax-comment-textbox').val('');
				
				//console.log("Success!!");
				//console.log(data);
				//console.log(status);
			},
			error: function (xhr, desc, err) {
				alert("Could not Post - "+err);
				//console.log(xhr);
				//console.log("Desc: " + desc + "\nErr:" + err);
			}
		});
	
	},
	

	famaxPostLike = function($famaxContainer,postId,famaxUserAccessToken) {
		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		var postCommentURL = "https://graph.facebook.com/v2.4/"+postId+"/likes";
		
		//console.log();
		$.ajax({
			url: postCommentURL,
			type: 'post',
			crossDomain: true,
			data: { access_token:famaxUserAccessToken },
			//contentType: "application/atom+xml",
			beforeSend: function(xhr){
				//xhr.setRequestHeader('X-GData-Key','key='+apiKey);
				//xhr.setRequestHeader('Authorization','Bearer '+youmaxAccessToken);
				//xhr.setRequestHeader('GData-Version','2');
				//xhr.setRequestHeader('Host','gdata.youtube.com');
				xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				//xhr.setRequestHeader('Content-Length',xmlComment.length);
			},
			success: function (data, status) {				
				
				//var famax_global_options = $famaxContainer.data('famax_global_options');			

				$famaxContainer.find('#famax-encloser-likes').prepend('<div class="famax-video-like '+famaxLoggedInUser.id+'"><div class="famax-like-from"><div class="famax-like-from-img" style="background-image:url(\''+famaxLoggedInUser.picture+'\');"></div><div class="famax-like-from-name">'+famaxLoggedInUser.name+'</div></div></div>');

				
				//getUserDetails(new Array(fromId),$famaxContainer,'comment');
				
				//$famaxContainer.find('.famax-add-like-button').attr('disabled','disabled').html('<i class="fa fa-check"></i>&nbsp;Liked');
				$famaxContainer.find('.famax-add-like-button').removeAttr('disabled').html('<i class="fa fa-facebook-square fa-lg"></i>&nbsp; LIKE');
				
				//console.log("Success!!");
				//console.log(data);
				//console.log(status);
			},
			error: function (xhr, desc, err) {
				alert("Could not add Like - "+err);
				$famaxContainer.find('.famax-add-like-button').removeAttr('disabled').html('<i class="fa fa-facebook-square fa-lg"></i>&nbsp; LIKE');
				//console.log(xhr);
				//console.log("Desc: " + desc + "\nErr:" + err);
			}
		});
	
	},
	

	
	//display page header
	displayPageHeader = function(response,$famaxContainer) {
		//console.log(response);
		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		var pageData = response;
		
		//alert(videoArray.length);
		pageId = pageData.id;
		pageTitle = pageData.name;
		//pageImage = ;
		pageLikes = pageData.likes;
		pageTalkingAbout = pageData.talking_about_count;
		if(null!=pageData.cover) {
			pageBackgroundImage = pageData.cover.source;
		} else {
			pageBackgroundImage="";
		}
		//console.log('pageBackgroundImage-'+pageBackgroundImage);
		
			 
		$famaxContainer.find('#famax-stat-holder').append('<div class="famax-stat"><span class="famax-stat-count">'+convertViewCount(pageTalkingAbout)+'</span><br/> TALKING </div><div class="famax-stat"><span class="famax-stat-count">'+convertViewCount(pageLikes)+'</span><br/>LIKES</div>');		
		
		$famaxContainer.find('#famax-select').prepend('<option value="pstream_'+pageId+'" class="famax-option-highlight" >Photos</span>');
		
		$famaxContainer.find('#famax-select').prepend('<option value="videos_'+pageId+'" class="famax-option-highlight" >Videos</span>');
		
		$famaxContainer.find('#famax-select').prepend('<option value="albums_'+pageId+'" class="famax-option-highlight" >Albums</span>');
		
		$famaxContainer.find('#famax-select').prepend('<option value="tagged_'+pageId+'" class="famax-option-highlight" >Tags</span>');

		$famaxContainer.find('#famax-select').prepend('<option value="posts_'+pageId+'" class="famax-option-highlight" >Posts</span>');
		
		if(famax_global_options.selectedTab.charAt(0)=='p') {
			$('#posts_'+pageId).click();
		} else if(famax_global_options.selectedTab.charAt(0)=='t') {
			$('#tagged_'+pageId).click();
		} else if(famax_global_options.selectedTab.charAt(0)=='l') {
			$('#albums_'+pageId).click();
		} else if(famax_global_options.selectedTab.charAt(0)=='v') {
			$('#videos_'+pageId).click();
		} else if(famax_global_options.selectedTab.charAt(0)=='h') {
			$('#pstream_'+pageId).click();
		}
		
		famax_global_options.fanPageId = pageId;
		famax_global_options.fanPageTitle = pageTitle;
		
	},
	
	/*TODO: Groups in Famax 5.0
	//display group header
	displayGroupHeader = function(response,$famaxContainer) {
		//console.log(response);
		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		var groupData = response;
		
		//alert(videoArray.length);
		pageId = groupData.id;
		pageTitle = groupData.name;

		if(null!=groupData.cover) {
			pageBackgroundImage = groupData.cover.source;
		} else {
			pageBackgroundImage="";
		}
		//console.log('pageBackgroundImage-'+pageBackgroundImage);
		
		
				 
		//$famaxContainer.find('#famax-stat-holder').append('<div class="famax-stat"><span class="famax-stat-count">'+convertViewCount(pageTalkingAbout)+'</span><br/> TALKING </div><div class="famax-stat"><span class="famax-stat-count">'+convertViewCount(pageLikes)+'</span><br/>LIKES</div>');		
		
		//Video Tab in the next version
		//$famaxContainer.find('#famax-select').prepend('<option value="videos_'+pageId+'" class="famax-option-highlight" >Videos</span>');
		

		$famaxContainer.find('#famax-select').prepend('<option value="feed_'+pageId+'" class="famax-option-highlight" >Feed</span>');
		
		if(famax_global_options.selectedTab.charAt(0)=='p') {
			$('#feed_'+pageId).click();
		}

		
		//famax_global_options.fanPageId = pageId;
		
	},
	*/
		
	//insert HTML thumbnails into famax grid
	insertPageFeeds = function(response,showFromUser,loadMoreFlag,$famaxContainer) {
		//console.log('insertPageFeeds');
		//console.log(response);
		
		//regenerate acceess Token if expired
		if(response.error!=null) {
			if(response.error.code==190 && response.error.message.indexOf('expired')!=-1) {
				alert('Session expired. Please reload the page.');
			}
		}
		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		var postIdArray = [];
		var videoPostIdArray = [];
		var videoIdArray = [];
		//var videoIdArray = [];
		var $famaxContainerList = $famaxContainer.find('ul');
		var likes_shares_comments_string = '';
		var linkStringStart = '';
		var linkStringEnd = '';
		
		//remove all posts if more than maxItemsDisplayed limit
		if($famaxContainerList.find('li').length>famax_global_options.maxItemsDisplayed) {
			showLoader($famaxContainer,true);
		}

		var feedArray = response.data;
		
		var nextPageApiUrl=null;
		if(null!=response.paging) {
			nextPageApiUrl = response.paging.next;
		}

		//added in v5
		if(feedArray.length == 0 && showFromUser) {
			$famaxContainerList.append('<li id="tags-not-found"><p><span class="famax-video-list-title">No More Tags Found..</span></p></li>');
		
		}
		
		//alert(videoArray.length);
		for(var i=0; i<feedArray.length; i++) {
		
			postType = feedArray[i].type;
			postId = feedArray[i].id;
			message = getProcessedMessage(feedArray[i].message);
			link = feedArray[i].link;
			
			if($famaxContainerList.find('#'+postId).length>0) {
				continue;
			}
			
			if(famax_global_options.onClickAction=="link") {
				linkStringStart = '<a class="famax-onclick-link" target="_blank" href="'+link+'">';
				linkStringEnd = '</a>';
			} else {
				linkStringStart = '';
				linkStringEnd = '';
			}
		
			//From user ---------------------------------
			if(showFromUser) {
				//we are showing the Tags page
				fromId = feedArray[i].from.id;
				fromImg = 'https://graph.facebook.com/v2.4/'+fromId+'/picture?type=normal&access_token='+famax_global_options.accessToken;
				fromName = feedArray[i].from.name;
				fromString = '<div class="famax-from"><div class="famax-from-img" style="background-image:url(\''+fromImg+'\');"></div><div class="famax-from-name">'+fromName+'</div></div>';
			} else {
				fromString = '';
			}
			
			
			//message-----------------------------
			if(message=="") {
				if(null!=feedArray[i].attachments) {
					//TODO: this will never be found here - push this to insert attachments
					message = feedArray[i].attachments.data[0].title;
				}
				if(null==message||message=="") {
					message = feedArray[i].description;
				}
				if(null==message||message=="") {
					message = feedArray[i].name;
				}		
				if(null==message || message=="") {
					message = "via "+famax_global_options.fanPageTitle;
				}
			}
			
			//Metrics = like + comment --------------------------------
			if((showFromUser && !famax_global_options.displayMetricsForTags) || ((!showFromUser && !famax_global_options.displayMetricsForPosts))){
				//Showing Tags and display Metrics for Tags is false.. OR
				//Showing Posts and display Metrics for Posts is false..
				likes_shares_comments_string = '';
			} else {
			
				if(null!=feedArray[i].likes) {
					post_likes = feedArray[i].likes.summary.total_count;
				} else {
					post_likes = 0;
				}
				
				if(null!=feedArray[i].comments) {
					post_comments = feedArray[i].comments.summary.total_count;
				} else {
					post_comments = 0;
				}
				
				if(null!=feedArray[i].shares) {
					post_shares = feedArray[i].shares.count;
				} else {
					post_shares = 0;
				}
				
				likes_shares_comments_string = '<div class="famax-likes-shares-comments-string"><div class="famax-show-likes"><i class="fa fa-thumbs-up"></i><div class="famax-likes-count">'+convertViewCount(post_likes)+'</div></div><div class="famax-show-comments"><i class="fa fa-comment"></i><div class="famax-comments-count">'+convertViewCount(post_comments)+'</div></div></div>';
				//<div class="famax-show-shares"><i class="fa fa-share"></i><div class="famax-shares-count">'+convertViewCount(post_shares)+'</div></div>			
			}
			
			//post type--------------------------------------
			if(postType=="photo") {
				postIdArray.push(postId);
				objectId = feedArray[i].object_id;
				//Adding low def picture first
				//picture = extractPicture(feedArray[i]);
				picture = feedArray[i].picture;
				/*if(picture==null) {
					picture = 'https://graph.facebook.com/v2.4/'+objectId+'/picture?type=normal&width=500&access_token='+famax_global_options.accessToken;
				}*/
				$famaxContainerList.append('<li id="'+postId+'">'+fromString+linkStringStart+'<div class="famax-image-wrapper"><img class="mfp-image famax-gallery-item" href="'+picture+'" src="'+picture+'"><div class="famax-hover-icon famax-hover-icon-search"><i class="fa fa-search"></i></div></div>'+linkStringEnd+'<p><span class="famax-video-list-title">'+message+'</span></p>'+likes_shares_comments_string+'</li>');
				//<span class="famax-video-list-views">'+getDateDiff(videoUploaded)+' ago</span>
			} else if(postType=="link") {
				postIdArray.push(postId);
				//Adding low def picture first
				//picture = extractPicture(feedArray[i]);
				picture = feedArray[i].picture;
				if(null==picture)picture=famax_global_options.notFoundImage;
				name = feedArray[i].name;
				if(null==name||name=="undefined")name="";
				description = feedArray[i].description;
				if(null==description)description="";
				link = feedArray[i].link;
				$famaxContainerList.append('<li id="'+postId+'">'+fromString+'<a class="famax-link-post" href="'+link+'" target="_blank"><div class="famax-image-wrapper"><img src="'+picture+'" href="'+picture+'" class="mfp-image"><div class="famax-hover-icon famax-hover-icon-link"><i class="fa fa-link fa-lg"></i></div></div></a><p><span class="famax-link-title">'+name+'</span><span class="famax-link-description">'+description+'</span><span class="famax-video-list-title">'+message+'</span></p>'+likes_shares_comments_string+'</li>');
				//<span class="famax-video-list-views">'+getDateDiff(videoUploaded)+' ago</span>
			}  else if(postType=="video") {
				objectId = feedArray[i].object_id;
				if(null!=objectId && objectId!="") {
					videoIdArray.push(objectId);
				} else {
					videoPostIdArray.push(postId);
				}
				picture = extractPicture(feedArray[i]);
				link = feedArray[i].link;
				if(link.indexOf('facebook.com')!=-1 && link.indexOf('/videos/')!=-1) {
					link = link.replace('/videos/','/video.php?v=');
				}
				$famaxContainerList.append('<li id="'+postId+'">'+fromString+linkStringStart+'<div class="famax-image-wrapper"><img data-lowresimage="'+feedArray[i].picture+'" id="'+objectId+'" class="mfp-iframe famax-gallery-item" href="'+link+'" src="'+picture+'"><div class="famax-hover-icon famax-hover-icon-play"><i class="fa fa-play"></i></div></div>'+linkStringEnd+'<p><span class="famax-video-list-title">'+message+'</span></p>'+likes_shares_comments_string+'</li>');
				fixLongLink(link,postId);
				//<span class="famax-video-list-views">'+getDateDiff(videoUploaded)+' ago</span>
			} else if(postType=="status") {
				if(null!=message && message!="") {
					$famaxContainerList.append('<li id="'+postId+'">'+fromString+'<p><span class="famax-video-list-title">'+message+'</span></p>'+likes_shares_comments_string+'</li>');
				}
				//<span class="famax-video-list-views">'+getDateDiff(videoUploaded)+' ago</span>
			} else {
				//console.log('new type found -'+type);
			}

		}

		createGrid(loadMoreFlag,$famaxContainer,postIdArray,videoIdArray,videoPostIdArray);
		
		//getAttachments(postIdArray,$famaxContainer);
		//getVideoDetails(videoIdArray,$famaxContainer);
		
	},



	//insert video details
	insertAlbumCoverPhotos = function(response,coverPhotoIdArray,$famaxContainer) {
		//console.log('insertAlbumCoverPhotos');
		//console.log(response);
		
		//regenerate acceess Token if expired
		if(response.error!=null) {
			if(response.error.code==190 && response.error.message.indexOf('expired')!=-1) {
				alert('Session expired. Please reload the page.');
			}
		}

		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		//var $famaxContainerList = $famaxContainer.find('ul');


		//alert(videoArray.length);
		for(var i=0; i<coverPhotoIdArray.length; i++) {
			
			photoId = coverPhotoIdArray[i];		
			
			postMainImage = $famaxContainer.find('#famax-video-list-div .'+photoId);	
			//console.log('postMainImage href-'+postMainImage.attr('href'));
			
			picture = extractAlbumImage(response[photoId]);
			
			//added in v5
			if(response[photoId].images.length>1) {
				ldPicture = response[photoId].images[response[photoId].images.length-2].source;
			} else {
				ldPicture = picture;
			}
			
			postMainImage.attr('data-hdpicture',picture);
			
			//console.log('picture-'+picture);
			postMainImage.attr('src',ldPicture);

		}
		//alert('done fixing..');
		
		/*famaxRefreshCount++;

		//Added to fix UI in Chrome after attachments are loaded
		var $famaxContainerList = $famaxContainer.find('ul');
		$famaxContainerList.imagesLoaded().always(function() {
			famaxRefreshCount--;
			if(famaxRefreshCount<=0) {
				$famaxContainerList.find('li').trigger('refreshWookmark');
			}			
		});*/

		//window.clearTimeout(famaxRefreshTimer);
		//famaxRefreshTimer = setTimeout(function(){famaxRefreshGrid($famaxContainer)}, famax_global_options.refreshTimeout);
		
		//added in v5 - create grid here 
		window.clearTimeout(famaxRefreshTimer);
		famaxRefreshTimer = setTimeout(function(){createGrid(null,$famaxContainer,null,null,null,true);}, famax_global_options.refreshTimeout);		

		
		
		//added in v5 - update thumbnail to HD
		//famaxRefreshTimer = setTimeout(function(){updateThumbnails("mfp-image",$famaxContainer);}, (2*famax_global_options.refreshTimeout));		

		
		
	},
	
	


	//insert attachments
	insertAttachments = function(response,postIdArray,$famaxContainer) {
		//console.log('insertAttachments');
		//console.log(response);
		
		//regenerate acceess Token if expired
		if(response.error!=null) {
			if(response.error.code==190 && response.error.message.indexOf('expired')!=-1) {
				alert('Session expired. Please reload the page.');
			}
		}

		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		//var $famaxContainerList = $famaxContainer.find('ul');


		//alert(videoArray.length);
		for(var i=0; i<postIdArray.length; i++) {
			
			postId = postIdArray[i];
			postType = response[postId].type;
			attachmentString = "";
			//console.log('postId-'+postId);
						
			
			//attachments--------------------------
			if(null!=response[postId].attachments) {
				subattachments = response[postId].attachments.data[0].subattachments;
				if(subattachments!=null && subattachments.length>=1) {
					subattachments = subattachments.data;
					attachmentString = '<div class="famax-attachment-holder">';
					for(var j=1;j<subattachments.length;j++) {
						attachmentString+='<div class="famax-attachment mfp-image famax-gallery-item" href="'+subattachments[j].media.image.src+'" style="background-image:url(\''+subattachments[j].media.image.src+'\');"></div>';
						//display only 4 max attachments
						if(j>=famax_global_options.maxAttachments) break;
					}
					attachmentString += '</div>';
					//console.log('attachmentString -'+attachmentString);
				}
			}
			
			
			postMainImage = $('#'+postId+' img.mfp-image');
			existingMessage = $('#'+postId+' .famax-video-list-title').text();
			//console.log('existingMessage-'+existingMessage);
			//Message fix-----------------------------
			if(null==existingMessage || existingMessage.trim()=="" || existingMessage.indexOf("via")==0) {
				if(null!=response[postId].attachments) {
					existingMessage = response[postId].attachments.data[0].title;
					$('#'+postId+' .famax-video-list-title').text(existingMessage);
				}
			}
			
			
			//post type--------------------------------------
			if(postType=="photo") {
				objectId = response[postId].object_id;
				picture = extractPicture(response[postId]);
				if(picture==null) {
					picture = 'https://graph.facebook.com/v2.4/'+objectId+'/picture?type=normal&width=500&access_token='+famax_global_options.accessToken;
				}
				//console.log('picture-'+picture);
				postMainImage.attr('src',picture);
				postMainImage.attr('href',picture);
				if(attachmentString!="") {
					postMainImage.after(attachmentString);
				}
			} else if(postType=="link") {
				picture = extractPicture(response[postId]);
				if(null==picture)picture=famax_global_options.notFoundImage;
				//console.log('picture-'+picture);
				postMainImage.attr('src',picture);
				//postMainImage.attr('href',picture);				
				if(attachmentString!="") {
					postMainImage.after(attachmentString);
				}
			}  else if(postType=="video") {
				picture = extractPicture(response[postId]);
				postMainImage = $('#'+postId+' img.mfp-iframe');
				postMainImage.attr('src',picture);
				//postMainImage.attr('href',picture);				
				if(attachmentString!="") {
					postMainImage.after(attachmentString);
				}
			} else if(postType=="status") {
			
			} else {
				//console.log('new type found -'+type);
			}

		}
		
		/*
		famaxRefreshCount++;

		//Added to fix UI in Chrome after attachments are loaded
		var $famaxContainerList = $famaxContainer.find('ul');
		$famaxContainerList.imagesLoaded().always(function() {
			famaxRefreshCount--;
			if(famaxRefreshCount<=0) {
				$famaxContainerList.find('li').trigger('refreshWookmark');
			}			
		});
		*/

		window.clearTimeout(famaxRefreshTimer);
		famaxRefreshTimer = setTimeout(function(){famaxRefreshGrid($famaxContainer);}, famax_global_options.refreshTimeout);

		
		
	},
	
	//insert video details
	insertVideoDetails = function(response,videoIdArray,$famaxContainer) {
		//console.log('insertVideoDetails');
		//console.log(response);
		
		//regenerate acceess Token if expired
		if(response.error!=null) {
			if(response.error.code==190 && response.error.message.indexOf('expired')!=-1) {
				alert('Session expired. Please reload the page.');
			}
		}

		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		//var $famaxContainerList = $famaxContainer.find('ul');


		//alert(videoArray.length);
		for(var i=0; i<videoIdArray.length; i++) {
			
			videoId = videoIdArray[i];		
			
			postMainImage = $('#'+videoId);	
			//console.log('postMainImage href-'+postMainImage.attr('href'));
			
			picture = extractVideoThumbnail(response[videoId]);
			//console.log('picture-'+picture);
			postMainImage.attr('src',picture);

		}

		/*
		famaxRefreshCount++;

		//Added to fix UI in Chrome after attachments are loaded
		var $famaxContainerList = $famaxContainer.find('ul');
		$famaxContainerList.imagesLoaded().always(function() {
			famaxRefreshCount--;
			if(famaxRefreshCount<=0) {
				$famaxContainerList.find('li').trigger('refreshWookmark');
			}			
		});
		*/
		
		window.clearTimeout(famaxRefreshTimer);
		famaxRefreshTimer = setTimeout(function(){famaxRefreshGrid($famaxContainer);}, famax_global_options.refreshTimeout);
		
		
		
		/*Removed refresh to improve Performance 
		var $famaxContainerList = $famaxContainer.find('ul');
		$famaxContainerList.imagesLoaded().always(function() {
			$famaxContainerList.find('li').trigger('refreshWookmark');
		}).progress(function(instance, image) {
			if(!image.isLoaded) {
				$img = $('img[src="'+image.img.src+'"]');
				$img.attr('src',famax_global_options.notFoundImage+'/unknown.jpg');
				$img.attr('href',famax_global_options.notFoundImage+'/unknown.jpg');
				$famaxContainerList.find('li').trigger('refreshWookmark');
			}
		});*/
		
	},
	
	//insert video details
	insertUserDetails = function(response,userIdArray,$famaxContainer,metric) {
		//console.log('insertUserDetails');
		//console.log(response);
		//console.log(userIdArray);
		
		//regenerate acceess Token if expired
		if(response.error!=null) {
			if(response.error.code==190 && response.error.message.indexOf('expired')!=-1) {
				alert('Session expired. Please reload the page.');
			}
		}

		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		//var $famaxContainerList = $famaxContainer.find('ul');


		//alert(videoArray.length);
		for(var i=0; i<userIdArray.length; i++) {
			
			userId = userIdArray[i];		
			
			commentFromUser = $famaxContainer.find('.'+userId+' .famax-'+metric+'-from-img');
			//console.log('postMainImage href-'+postMainImage.attr('href'));
			
			picture = response[userId].picture.data.url;
			//console.log('picture-'+picture);
			commentFromUser.css('background-image','url('+picture+')');

		}
		
	},
	
	
	//insert video thumbnails into famax grid
	insertLikeFeeds = function(response,itemId,loadMoreFlag,$famaxContainer) {
		//console.log('insertLikeFeeds');
		//console.log(response);
		
		//regenerate acceess Token if expired
		if(response.error!=null) {
			if(response.error.code==190 && response.error.message.indexOf('expired')!=-1) {
				alert('Session expired. Please reload the page.');
			}
		}

		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		var $famaxLikeHolder = $famaxContainer.find('#famax-encloser-likes');
		var feedArray = response.data;
		var userIdArray = [];
		
		if(!loadMoreFlag) {
			//empty earlier likes if not load more
			$famaxLikeHolder.empty();
		}

		
		var nextPageApiUrl=null;
		if(null!=response.paging) {
			nextPageApiUrl = response.paging.next;
		}
		
		var $famaxLoadMoreLikesDiv = $famaxContainer.find('.famax-encloser-button.famax-more-likes-button');
		$famaxLoadMoreLikesDiv.data('postid',itemId);
		if(null!=nextPageApiUrl && nextPageApiUrl!="undefined" && nextPageApiUrl!="") {
			$famaxLoadMoreLikesDiv.data('nextpageapiurl',nextPageApiUrl);
		} else {
			$famaxLoadMoreLikesDiv.data('nextpageapiurl','');
		}

		//alert(videoArray.length);
		for(var i=0; i<feedArray.length; i++) {
			
			fromId = feedArray[i].id;
			fromName = feedArray[i].name;
			
			userIdArray.push(fromId);
			
			$famaxLikeHolder.append('<div class="famax-video-like '+fromId+'"><div class="famax-like-from"><div class="famax-like-from-img" style="background-image:url(\''+famax_global_options.notFoundImage+'\');"></div><div class="famax-like-from-name">'+fromName+'</div></div></div>');

			
			//<span class="famax-video-list-views">'+getDateDiff(videoUploaded)+' ago</span>

		}
		
		getUserDetails(userIdArray,$famaxContainer,'like');
		
	},
	
	
	//insert video thumbnails into famax grid
	insertCommentFeeds = function(response,itemId,loadMoreFlag,$famaxContainer) {
		//console.log('insertCommentFeeds');
		//console.log(response);
		
		//regenerate acceess Token if expired
		if(response.error!=null) {
			if(response.error.code==190 && response.error.message.indexOf('expired')!=-1) {
				alert('Session expired. Please reload the page.');
			}
		}

		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		var $famaxCommentHolder = $famaxContainer.find('#famax-encloser-comments');
		var feedArray = response.data;
		var userIdArray = [];
		
		if(!loadMoreFlag) {
			//empty earlier comments if not load more
			$famaxCommentHolder.empty();
		}

		
		var nextPageApiUrl=null;
		if(null!=response.paging) {
			nextPageApiUrl = response.paging.next;
		}
		
		var $famaxLoadMoreCommentsDiv = $famaxContainer.find('.famax-encloser-button.famax-more-comments-button');
		$famaxLoadMoreCommentsDiv.data('postid',itemId);
		if(null!=nextPageApiUrl && nextPageApiUrl!="undefined" && nextPageApiUrl!="") {
			$famaxLoadMoreCommentsDiv.data('nextpageapiurl',nextPageApiUrl);
		} else {
			$famaxLoadMoreCommentsDiv.data('nextpageapiurl','');
		}

		//alert(videoArray.length);
		for(var i=0; i<feedArray.length; i++) {
			
			commentId = feedArray[i].id;
			message = getProcessedMessage(feedArray[i].message,true);
			commentPublished = feedArray[i].created_time;
			fromId = feedArray[i].from.id;
			fromName = feedArray[i].from.name;
			
			userIdArray.push(fromId);
			
			$famaxCommentHolder.append('<div class="famax-video-comment '+fromId+'"><div class="famax-comment-from"><div class="famax-comment-from-img" style="background-image:url(\''+famax_global_options.notFoundImage+'\');"></div><div class="famax-comment-from-name">'+fromName+'</div><div class="famax-published">'+getDateDiff(commentPublished)+' </div></div><div class="famax-comment"><span class="famax-comment-content">'+message+'</span><div></div>');

			
			//<span class="famax-video-list-views">'+getDateDiff(videoUploaded)+' ago</span>

		}
		
		getUserDetails(userIdArray,$famaxContainer,'comment');
		
	},
		

	
	//insert video thumbnails into famax grid
	insertVideoFeeds = function(response,loadMoreFlag,$famaxContainer) {
		//console.log('insertVideoFeeds');
		//console.log(response);
		
		//regenerate acceess Token if expired
		if(response.error!=null) {
			if(response.error.code==190 && response.error.message.indexOf('expired')!=-1) {
				alert('Session expired. Please reload the page.');
			}
		}

		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		var $famaxContainerList = $famaxContainer.find('ul');
		var feedArray = response.data;
		var linkStringStart='';
		var linkStringEnd='';
		var likes_shares_comments_string='';
		
		//remove all posts if more than maxItemsDisplayed limit
		if($famaxContainerList.find('li').length>famax_global_options.maxItemsDisplayed) {
			showLoader($famaxContainer,true);
		}		
		
		var nextPageApiUrl=null;
		if(null!=response.paging) {
			nextPageApiUrl = response.paging.next;
		}
		
		
		//added in v5
		if(feedArray.length == 0) {
			$famaxContainerList.append('<li id="tags-not-found"><p><span class="famax-video-list-title">No More Videos Found..</span></p></li>');
		
		}
		

		//alert(videoArray.length);
		for(var i=0; i<feedArray.length; i++) {

			//Metrics --------------------------------
			if(!famax_global_options.displayMetricsForPosts) {
				//Display Metrics for Posts is false..
				likes_shares_comments_string = '';
			} else {				
				//4.0 likes-comments-shares
				if(null!=feedArray[i].likes) {
					post_likes = feedArray[i].likes.summary.total_count;
				} else {
					post_likes = 0;
				}
				
				if(null!=feedArray[i].comments) {
					post_comments = feedArray[i].comments.summary.total_count;
				} else {
					post_comments = 0;
				}
				
				if(null!=feedArray[i].shares) {
					post_shares = feedArray[i].shares.count;
				} else {
					post_shares = 0;
				}
				
				likes_shares_comments_string = '<div class="famax-likes-shares-comments-string"><div class="famax-show-likes"><i class="fa fa-thumbs-up"></i><div class="famax-likes-count">'+convertViewCount(post_likes)+'</div></div><div class="famax-show-comments"><i class="fa fa-comment"></i><div class="famax-comments-count">'+convertViewCount(post_comments)+'</div></div></div>';
				//<div class="famax-show-shares"><i class="fa fa-share"></i><div class="famax-shares-count">'+convertViewCount(post_shares)+'</div></div>
			}
			videoId = feedArray[i].id;
			message = getProcessedMessage(feedArray[i].description);
			
			//message-----------------------------
			if(message=="") {				
				if(null==message||message=="") {
					message = feedArray[i].description;
				}
				if(null==message || message=="") {
					message = "via "+famax_global_options.fanPageTitle;
				}
			}
			
			picture = extractVideoThumbnail(feedArray[i]);
			link = "https://www.facebook.com/video.php?v="+videoId;
			
			//Link to facebook for Photos
			if(famax_global_options.onClickAction=="link") {
				linkStringStart = '<a class="famax-onclick-link" target="_blank" href="'+link+'">';
				linkStringEnd = '</a>';
			} else {
				linkStringStart = '';
				linkStringEnd = '';
			}
			
			//added in v5
			if(feedArray[i].format.length>=1) {
				ldPicture = feedArray[i].format[0].picture;
			} else {
				ldPicture = picture;
			}

			
			$famaxContainerList.append('<li id="'+videoId+'">'+linkStringStart+'<div class="famax-image-wrapper"><img class="mfp-iframe famax-gallery-item" data-hdpicture="'+picture+'" href="'+link+'" src="'+ldPicture+'"><div class="famax-hover-icon famax-hover-icon-play"><i class="fa fa-play"></i></div></div>'+linkStringEnd+'<p><span class="famax-video-list-title">'+message+'</span></p>'+likes_shares_comments_string+'</li>');
			
			//<span class="famax-video-list-views">'+getDateDiff(videoUploaded)+' ago</span>

		}
		
		createGrid(loadMoreFlag,$famaxContainer,null,null,null,true);
		
		//added in v5 - update thumbnail to HD
		//window.clearTimeout(famaxRefreshTimer);
		//famaxRefreshTimer = setTimeout(function(){updateThumbnails("famax-gallery-item",$famaxContainer)}, famax_global_options.refreshTimeout);
		
		
	},
	
	
	//Insert image thumbnails into famax grid
	insertPhotoFeeds = function(response,loadMoreFlag,$famaxContainer) {
		//console.log('insertPhotoFeeds');
		//console.log(response);
		
		//regenerate acceess Token if expired
		if(response.error!=null) {
			if(response.error.code==190 && response.error.message.indexOf('expired')!=-1) {
				alert('Session expired. Please reload the page.');
			}
		}
		

		
		var famax_global_options = $famaxContainer.data('famax_global_options');		
		var $famaxContainerList = $famaxContainer.find('ul');
		var feedArray = response.data;
		var linkStringStart = '';
		var linkStringEnd = '';
		var likes_shares_comments_string = '';
		
		//remove all posts if more than maxItemsDisplayed limit
		if($famaxContainerList.find('li').length>famax_global_options.maxItemsDisplayed) {
			showLoader($famaxContainer,true);
		}		
		
		var nextPageApiUrl=null;
		if(null!=response.paging) {
			nextPageApiUrl = response.paging.next;
		}
	

		//alert(videoArray.length);
		for(var i=0; i<feedArray.length; i++) {
			
			//Link to facebook for Photos
			if(famax_global_options.onClickAction=="link") {
				linkStringStart = '<a class="famax-onclick-link" target="_blank" href="'+feedArray[i].link+'">';
				linkStringEnd = '</a>';
			} else {
				linkStringStart = '';
				linkStringEnd = '';
			}

			
			//Metrics -------------------------------
			if(!famax_global_options.displayMetricsForPosts) {
				//Display Metrics for Posts is false..
				likes_shares_comments_string = '';
			} else {
				//4.0 likes-comments-shares
				if(null!=feedArray[i].likes) {
					post_likes = feedArray[i].likes.summary.total_count;
				} else {
					post_likes = 0;
				}
				
				if(null!=feedArray[i].comments) {
					post_comments = feedArray[i].comments.summary.total_count;
				} else {
					post_comments = 0;
				}
				
				if(null!=feedArray[i].shares) {
					post_shares = feedArray[i].shares.count;
				} else {
					post_shares = 0;
				}
				
				likes_shares_comments_string = '<div class="famax-likes-shares-comments-string"><div class="famax-show-likes"><i class="fa fa-thumbs-up"></i><div class="famax-likes-count">'+convertViewCount(post_likes)+'</div></div><div class="famax-show-comments"><i class="fa fa-comment"></i><div class="famax-comments-count">'+convertViewCount(post_comments)+'</div></div></div>';
				//<div class="famax-show-shares"><i class="fa fa-share"></i><div class="famax-shares-count">'+convertViewCount(post_shares)+'</div></div>
			}
		
			imageId = feedArray[i].id;
			message = getProcessedMessage(feedArray[i].name);
			if(null==message || message=="") {
				message = "via "+famax_global_options.fanPageTitle;
			}
			picture = extractAlbumImage(feedArray[i]);
			
			//added in v5
			if(feedArray[i].images.length>1) {
				ldPicture = feedArray[i].images[feedArray[i].images.length-2].source;
			} else {
				ldPicture = picture;
			}
			
			$famaxContainerList.append('<li id="'+imageId+'">'+linkStringStart+'<div class="famax-image-wrapper"><img class="mfp-image famax-gallery-item" href="'+picture+'" data-hdpicture="'+picture+'" src="'+ldPicture+'"><div class="famax-hover-icon famax-hover-icon-search"><i class="fa fa-search"></i></div></div>'+linkStringEnd+'<p><span class="famax-video-list-title">'+message+'</span></p>'+likes_shares_comments_string+'</li>');
			//<span class="famax-video-list-views">'+getDateDiff(videoUploaded)+' ago</span>

		}
		
		createGrid(loadMoreFlag,$famaxContainer,null,null,null,true);
		
		//added in v5 - update thumbnail to HD
		//window.clearTimeout(famaxRefreshTimer);
		//famaxRefreshTimer = setTimeout(function(){updateThumbnails("famax-gallery-item",$famaxContainer)}, famax_global_options.refreshTimeout);		
		
	},

	updateThumbnails = function($famaxContainer) {
	
		//var $famaxContainerList = $famaxContainer.find('ul');
		
		//var pimax_global_options = $pimaxContainer.data('pimax_global_options');	
		var photoThumbnail,updatedPhotoThumbnail,thumbnailUpdated=false;
		//console.log("in updateThumbnails");

		var items = document.getElementsByClassName("famax-gallery-item");
		if(null==items || items.length==0) {
			items = document.getElementsByClassName("mfp-image");
		}
		
		for (var i = items.length; i--;) {
			photoThumbnail = items[i].src;
			updatedPhotoThumbnail=items[i].getAttribute('data-hdpicture');
			//console.log(updatedPhotoThumbnail);
				
			if(null!=photoThumbnail && null!=updatedPhotoThumbnail && updatedPhotoThumbnail!="" && updatedPhotoThumbnail!=photoThumbnail) {
				items[i].src = updatedPhotoThumbnail;
				thumbnailUpdated=true;
			} else {
				continue;
			}
			
			
		}
		
		if(thumbnailUpdated) {
			famaxRefreshGrid($famaxContainer);
		}
		
	},

	//Insert image thumbnails into famax grid
	insertAlbumFeeds = function(response,loadMoreFlag,$famaxContainer) {
		//console.log('insertAlbumFeeds');
		//console.log(response);
		
		//regenerate acceess Token if expired
		if(response.error!=null) {
			if(response.error.code==190 && response.error.message.indexOf('expired')!=-1) {
				alert('Session expired. Please reload the page.');
			}
		}

		
		var famax_global_options = $famaxContainer.data('famax_global_options');
		var coverPhotoIdArray = [];
		var $famaxContainerList = $famaxContainer.find('ul');
		var feedArray = response.data;
		var linkStringStart='';
		var linkStringEnd='';

		//remove all posts if more than maxItemsDisplayed limit
		if($famaxContainerList.find('li').length>famax_global_options.maxItemsDisplayed) {
			showLoader($famaxContainer,true);
		}
		
		var nextPageApiUrl=null;
		if(null!=response.paging) {
			nextPageApiUrl = response.paging.next;
		}
		

		//alert(videoArray.length);
		for(var i=0; i<feedArray.length; i++) {
			albumId = feedArray[i].id;
			albumName = feedArray[i].name;
			photoCount = feedArray[i].count;
			
			if(null==feedArray[i].cover_photo) {
				continue;
			}
			
			coverPhotoId = feedArray[i].cover_photo.id;
			
			if(null==photoCount)
				continue;

			if(famax_global_options.onClickAction=="link") {
				linkStringStart = '<a class="famax-onclick-link" target="_blank" href="'+feedArray[i].link+'">';
				linkStringEnd = '</a>';
			} else {
				linkStringStart = '';
				linkStringEnd = '';
			}

				
			$famaxContainerList.append('<li id="photos_'+albumId+'">'+linkStringStart+'<img class="mfp-image '+coverPhotoId+'" src=""><div class="famax-album-photo-count-wrapper"><div class="famax-album-photo-count-box"><span class="famax-album-photo-count">'+photoCount+'</span><br>PHOTOS<br><div class="famax-album-line-wrapper"><span class="famax-album-line"></span><br><span class="famax-album-line"></span><br><span class="famax-album-line"></span></div></div></div>'+linkStringEnd+'<p><span class="famax-video-list-title">'+albumName+'</span></p></li>');

			if(null!=coverPhotoId && coverPhotoId!="") {
				coverPhotoIdArray.push(coverPhotoId);
			}
		}
		
		//changed in v5
		//createGrid(loadMoreFlag,$famaxContainer,null,null,null,coverPhotoIdArray);
		getAlbumCoverPhotos(coverPhotoIdArray,$famaxContainer);	
		
	},

	

	
	//convert shortened links to long links
	fixLongLink = function (link, postId) {
		
		
		if(link.indexOf('bit.ly')==-1 && link.indexOf('goo.gl')==-1 && link.indexOf('youtubeshare.com')==-1 && link.indexOf('youtu.be')==-1 && link.indexOf('tinyurl.com')==-1) {
			addLinkToNoEmbedVideos(link, postId);
			return;
		}
		
		
		apiUrl = "http://api.longurl.org/v2/expand?format=json&url="+link;
		
		//console.log('getLongLink apiUrl-'+apiUrl,postId);
		
		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { 
				//console.log(response,postId);
				if(null!=response["long-url"]) {
					$('#'+postId+' img').attr('href',response["long-url"]);
					addLinkToNoEmbedVideos(response["long-url"], postId);
				}
			},
			error: function(html) { alert(html); },
			beforeSend: setHeader
		});

		
		
	},
	
	//add links over videos that cannot be shown in lightbox
	addLinkToNoEmbedVideos = function(link, postId) {
		//console.log('addLinkToNoEmbedVideos link - '+link);
		//console.log('addLinkToNoEmbedVideos postId - '+postId);
		if(link.indexOf('youtube.com')==-1 && link.indexOf('vimeo.com')==-1 && link.indexOf('facebook.com')==-1) {
			$('#'+postId+' img').removeClass('famax-gallery-item');
			$('#'+postId+' img').wrap('<a target="_blank" class="famax-link-post" href="'+link+'">');
		}
		
		if(link.indexOf('vimeo.com/ondemand/')!=-1) {
			//console.log('in wrap');
			$('#'+postId+' img').removeClass('famax-gallery-item');
			$('#'+postId+' img').wrap('<a target="_blank" class="famax-link-post" href="'+link+'"></a>');
		}
		
	},
	
	//process message text
	getProcessedMessage = function(message,isComment) {
	
		if(null==message) {
			message = "";
			return message;
		}
		
		if(null==isComment || isComment==false) {
			//wrap links
			spotArray = message.match(/http(s)*:\/\/.+?(\s|\n|$)/g);
			//console.log(message);
			//console.log(spotArray);
			if(null!=spotArray) {
				for(var i=0;i<spotArray.length;i++) {
					spotArray[i] = spotArray[i].trim();
					message = message.replace(spotArray[i],'<a target="_blank" href="'+spotArray[i]+'" class="famax-link">'+spotArray[i]+'</a>');
					//use if hashtags are also being processed
					//replaceText = spotArray[i].replace('#',':hash:');
					//message = message.replace(spotArray[i],'<a target="_blank" href="'+replaceText+'" class="famax-link">'+replaceText+'</a>');
				}
			}
		}
		/*
		//TODO: wrap hashtags in future version
		spotArray = message.match(/#(\w|\d)+/g);
		//console.log(message);
		//console.log(spotArray);
		if(null!=spotArray) {
			for(var i=0;i<spotArray.length;i++) {
				message = message.replace(spotArray[i],'<span class="famax-link">'+spotArray[i]+'</span>');
			}
		}
		*/
		
		
		//message = message.replace(/:hash:/g,'#');
		
		//4.0 added 
		message = message.replace(/\n/g,"<br>");

		return message;
	
	},

	//extract picture for post
	extractPicture = function(feed) {
		
		//console.log('extractPicture-'+picture);
		
		picture = feed.picture;
		if(null!=picture && picture.indexOf("safe_image.php")!=-1) {
			picture = picture.substring(picture.indexOf('url=')+4);
			if(picture.indexOf('&')!=-1) {
				picture = picture.substring(0,picture.indexOf('&'));
			}
			if(picture.indexOf('?')!=-1) {
				picture = picture.substring(0,picture.indexOf('?'));
			}
			picture = decodeURIComponent(picture);
			//console.log('picture-'+picture);
			if(picture.indexOf("http")==0 || picture.indexOf("https")==0) {
				return picture;
			}
		} 
		
		if(null!=feed.attachments && null!=feed.attachments.data[0].subattachments){
			picture = feed.attachments.data[0].subattachments.data[0].media.image.src;
			return picture;
		} 
		
		if(null!=feed.attachments && null!=feed.attachments.data[0].media){
			picture = feed.attachments.data[0].media.image.src;
			return picture;
		}
		

		picture = feed.picture;
		return picture;

	},
	
	//extract picture for album
	extractAlbumImage = function(feed) {
		
		var picture;
		//console.log('extractVideoThumbnail-');
		//console.log(feed);

		for(var k=0,l=feed.images.length-1;k<l;k++) {
			picture = feed.images[k].source;
			width = feed.images[k].width;
			
			if(width<=900) break;
		
		}

		return picture;

		/*
		pictureArray = feed.images;
		picture = pictureArray[0].source;
		return picture;*/

	},
	
	//extract picture for video
	extractVideoThumbnail = function(feed) {
		var picture;
		//console.log('extractVideoThumbnail-');
		//console.log(feed);
		for(var k=feed.format.length-1;k>=0;k--) {
			picture = feed.format[k].picture;
			width = feed.format[k].width;
			
			if(width<800) break;
		
		}

		return picture;

	},
	
	getDateDiff = function (timestamp) {
		if(null==timestamp||timestamp==""||timestamp=="undefined")
			return "?";
		//console.log(timestamp);
		
		dateDiffMS = Math.abs(new Date() - new Date(timestamp));
		//console.log(dateDiffMS);
		
		dateDiffHR = dateDiffMS/1000/60/60;
		if(dateDiffHR>24) {
			dateDiffDY = dateDiffHR/24;
			if(dateDiffDY>30) {
				dateDiffMH = dateDiffDY/12;
				if(dateDiffMH>12) {
					dateDiffYR = dateDiffMH/12;
					dateDiffYR = Math.round(dateDiffYR);
					if(dateDiffYR<=1) {
						return dateDiffYR+" year ago";
					} else {
						return dateDiffYR+" years ago";
					}						
				} else {
					dateDiffMH = Math.round(dateDiffMH);
					if(dateDiffMH<=1) {
						return dateDiffMH+" month ago";
					} else {
						return dateDiffMH+" months ago";
					}						
				}
			} else {
				dateDiffDY = Math.round(dateDiffDY);
				if(dateDiffDY<=1) {
					return dateDiffDY+" day ago";
				} else {
					return dateDiffDY+" days ago";
				}
			}
		} else {
			dateDiffHR = Math.round(dateDiffHR);
			if(dateDiffHR<1) {
				return "just now";
			}else if(dateDiffHR==1) {
				return dateDiffHR+" hour ago";
			} else {
				return dateDiffHR+" hours ago";
			}
		}		

	
	},
	
	
	/*
	//utility function for date time
	getDateDiff = function (timestamp) {
		if(null==timestamp||timestamp==""||timestamp=="undefined")
			return "?";
		//alert(timestamp);
		var splitDate=((timestamp.toString().split('T'))[0]).split('-');
		var d1 = new Date();		
		
		var d1Y = d1.getFullYear();
		var d2Y = parseInt(splitDate[0],10);
		var d1M = d1.getMonth();
		var d2M = parseInt(splitDate[1],10);

		var diffInMonths = (d1M+12*d1Y)-(d2M+12*d2Y);
		if(diffInMonths<=1)
			return "1 month";
		else if(diffInMonths<12)
			return  diffInMonths+" months";
		
		var diffInYears = Math.floor(diffInMonths/12);
		
		if(diffInYears<=1)
			return "1 year";
		else if(diffInYears<12)
			return  diffInYears+" years";

	},
	
	*/
	
	//create grid layout using Wookmark plugin
	createGrid = function(loadMoreFlag, $famaxContainer, postIdArray, videoIdArray, videoPostIdArray, updateThumbnailsFlag /*,fixedThumbnails*/) {
		var famax_global_options = $famaxContainer.data('famax_global_options');	
		var $famaxContainerList = $famaxContainer.find('ul');
		var minThumbnailWidth,maxThumbnailWidth;
		//clearTimeout(famax_timeout);
		//$famaxContainerList.imagesLoaded().always(function() {
		$famaxContainerList.imagesLoaded().always(function() {
			
			$famaxContainerList.find('.famax-loading-div').remove();
			
			var options = {
			  autoResize: true, // This will auto-update the layout when the browser window is resized.
			  container: $famaxContainer.find('#famax-video-list-div'), // Optional, used for some extra CSS styling
			  offset: famax_global_options.innerOffset, // Optional, the distance between grid items
			  itemWidth: famax_global_options.minItemWidth, // Optional, the width of a grid item
			  flexibleWidth : famax_global_options.maxItemWidth,
			  outerOffset: famax_global_options.outerOffset
			};

			
			var handler = $famaxContainerList.find('li');
			
			// Call the layout function.
			handler.wookmark(options);
			
			//famaxRefreshGrid($famaxContainer);
			
			if(famax_global_options.onClickAction=="popup") {
				registerPopup($famaxContainer);
			}
			
			
			getAttachments(postIdArray,$famaxContainer);
			getVideoDetails(videoIdArray,$famaxContainer);
			getAttachments(videoPostIdArray,$famaxContainer);
			
			//removed in v5 - added directly to getter
			//getAlbumCoverPhotos(coverPhotoIdArray,$famaxContainer);
		
			//addded in v5 for albums covers, photos and video thumbnails
			if(updateThumbnailsFlag) {
				window.clearTimeout(famaxRefreshTimer);
				famaxRefreshTimer = setTimeout(function(){updateThumbnails($famaxContainer);}, famax_global_options.refreshTimeout);			
			}
			
			
			//famaxRefreshCount++;
			//window.clearTimeout(famaxRefreshTimer);
			//famaxRefreshTimer = setTimeout(function(){famaxRefreshGrid($famaxContainer)}, famax_global_options.refreshTimeout);
		});
		
	},
	
	famaxRefreshGrid = function($famaxContainer) {
		var $famaxContainerList = $famaxContainer.find('ul');
		var famax_global_options = $famaxContainer.data('famax_global_options');	
		var options = {
		  autoResize: true, // This will auto-update the layout when the browser window is resized.
		  container: $famaxContainer.find('#famax-video-list-div'), // Optional, used for some extra CSS styling
		  offset: famax_global_options.innerOffset, // Optional, the distance between grid items
		  itemWidth: famax_global_options.minItemWidth, // Optional, the width of a grid item
		  flexibleWidth : famax_global_options.maxItemWidth,
		  outerOffset: famax_global_options.outerOffset
		};
		
		
		$famaxContainerList.imagesLoaded().always(function() {
			//$famaxContainerList.find('li').trigger('refreshWookmark');
			$famaxContainerList.find('li').wookmark(options);
			//console.log('triggered refresh');
		}).progress(function(instance, image) {
			if(!image.isLoaded) {
				$img = $('img[src="'+image.img.src+'"]');
				
				//TODO: replace with a small resolution image
				lowResImage = $img.data("lowresimage");
				if(null!=lowResImage) {
					$img.attr('src',lowResImage);
				} else {
					$img.attr('src',famax_global_options.notFoundImage);
				}
				
				//TODO: check if it is an image only then replace the href
				//removed to let video hrefs be unmodified
				//$img.attr('href',famax_global_options.notFoundImage+'/unknown_person.jpg');
				
				//TODO: remove to improve performance
				//console.log('triggered refresh');
				$famaxContainerList.find('li').wookmark(options);
			}
		});
	
	},

	
	//register popup on image and video thumbnails
	registerPopup = function($famaxContainer) {
	
		var famax_global_options = $famaxContainer.data('famax_global_options');
			
			$famaxContainer.find('#famax-video-list-div #tiles').magnificPopup({
				//type:'image',
				delegate: '.famax-gallery-item',
				gallery: {
					enabled:true
				},
				iframe:{
					markup: '<div class="mfp-iframe-scaler">'+
					'<div class="famax-iframe-icon-play"><i class="fa fa-play fa-1x"></i></div>'+
					'<div class="mfp-close"></div>'+
					'<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
					'</div>',
					patterns: {
							youtube: {
								index: 'youtube.com/',
								id: function(url) { 
									tid=url.split('v=')[1];
									if(tid.indexOf('&')!=-1) {
										tid=tid.substring(0,tid.indexOf('&'));
									}
									return tid; 
								}, 
								src: 'http://www.youtube.com/embed/%id%?rel=0&autoplay=1'
							},
							facebook : {
								index: 'facebook.com/',
								id: '?v=',
								//id: '/videos/',
								src: 'http://www.facebook.com/video/embed?video_id=%id%'
							},
							/*vimeoondemand : {
								index: 'vimeo.com/ondemand',
								id: function(url) { 
									tid=url.split('/ondemand/')[1];
									if(tid.indexOf('&')!=-1) {
										tid=tid.substring(0,tid.indexOf('&'));
										//console.log('vimeo ondemand - '+tid);
									}
									return tid; 
								},
								src: 'http://player.vimeo.com/video/%id%?autoplay=1'
							},*/
							vimeo: {
								index: 'vimeo.com/',
								id: '/',
								src: 'http://player.vimeo.com/video/%id%?autoplay=1'
							}
							
						}
				},
				preloader:false,
				showCloseBtn: true, 
				closeBtnInside: true, 
				closeOnContentClick: false, 
				closeOnBgClick: true, 
				enableEscapeKey: true, 
				modal: false, 
				alignTop: false, 
				removalDelay: 100, 
				mainClass: ' ',
				callbacks: {
					markupParse: function(template, values, item) {
						// Triggers each time when content of popup changes
						//console.log('markupParse:',item);
						$('.famax-fb-fix').remove();
						if(item.src.indexOf("facebook.com")!=-1 && item.src.indexOf("?v=")!=-1 && null!=item.el) {
							//console.log('resizing iframe to width - '+item.el.context.naturalWidth);
							
							var naturalWidth = item.el.context.naturalWidth;
							var naturalHeight = item.el.context.naturalHeight;
							//var aspectRatio = naturalHeight/naturalWidth;
							
							if(naturalWidth<320) {
								naturalWidth=320;
							}
							if(naturalWidth>900) {
								naturalWidth=900;
							}
							
							var style = $('<style class="famax-fb-fix">.mfp-content { max-width: '+naturalWidth+'px !important; } .famax-iframe-icon-play{display: inline-block !important;}</style>');
							$('html > head').append(style);
							//$('.mfp-container>.mfp-content').css('max-width',item.el.context.naturalWidth);
							
						}
					}			
				}
			});	
			
			/* TODO: no need found
			$("body").on("click",".mfp-content",function(){
				$(".famax-iframe-icon-play").css("display","none");
			});*/
				
	
	},
	
	
	//display loading.. text
	showLoader = function($famaxContainer,keepShowingTitle) {
		$famaxContainer.find('#famax-video-list-div>ul').empty();
		//$famaxContainer.find('#famax-video').hide();
		//$famaxContainer.find('#famax-video').attr('src','');
		$famaxContainer.find('#famax-video-list-div>ul').append('<div class="famax-loading-div"><br><br><br><br><br><br>loading HD...<br><br><br><br><br><br></div>');
		
	},
	
	//retrieve access token
	getAccessToken = function(options,$famaxContainer) {
		var apiUrl;
		//added code for WordPress sync
		if(null!=options.accessToken && options.accessToken!="") {
			//assume that we have an access token ready via php
			//WordPress version will us this
			prepareFamax(options.accessToken,$famaxContainer);
			return;
		} else {
			//assume that we have an app id and an app secret
			//jQuery version will use this
			apiUrl = 'https://graph.facebook.com/v2.4/oauth/access_token?client_id='+options.appId+'&client_secret='+options.appSecret+'&grant_type=client_credentials';
		}
		
		//console.log('getAccessToken apiUrl-'+apiUrl);
		
		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'text',
			success: function(response) {
				var token = response.substring(response.indexOf('=')+1);
				prepareFamax(token,$famaxContainer);
			},
			error: function(html,status) { 
				//using permanent accessToken in case of failure
				if(null!=options.appSecret && options.appSecret!="") {
					prepareFamax(options.appId+'|'+options.appSecret,$famaxContainer);
				} else {
					alert('Cannot find access token'+html)
				}
			},
			beforeSend: setHeader
		});
	
	},
	
	prepareFamax = function(token,$famaxContainer) {
		//console.log(response);
		var famax_global_options = $famaxContainer.data('famax_global_options');
		famax_global_options.accessToken = token;
		$famaxContainer.data('famax_global_options',famax_global_options);
		
		//inititalize Famax 
		initFamax($famaxContainer);
		getPageDetails($famaxContainer);
		/* Groups will be added in 5.0
		if(famax_global_options.type=="group") {
			getGroupDetails($famaxContainer);
		} else {
			getPageDetails($famaxContainer);
		}*/
		getAlbumDetails(famax_global_options.albumIdArray,$famaxContainer);
	},
	
	
	//get details of all playlists mentioned in famax options
	getAlbumDetails = function (albumIdArray,$famaxContainer) {
		//console.log('inside getPlaylistDetails');
		//console.log(playlistIdArray);
		var famax_global_options = $famaxContainer.data('famax_global_options');
		
		apiUrl = "https://graph.facebook.com/v2.4/?ids="+albumIdArray+"&access_token="+famax_global_options.accessToken;

		$.ajax({
			url: apiUrl,
			type: "GET",
			async: true,
			cache: true,
			dataType: 'jsonp',
			success: function(response) { displayTabs(response,$famaxContainer);},
			error: function(html) { alert(html); },
			beforeSend: setHeader
		});
	},
	
	//display tabs for albums
	displayTabs = function(response,$famaxContainer) {
		//console.log(response);
		var famax_global_options = $famaxContainer.data('famax_global_options');
		var albumIdArray = famax_global_options.albumIdArray;
		
		//alert(videoArray.length);
		$famaxSelect = $famaxContainer.find('#famax-select');
		for(var i=0; i<albumIdArray.length; i++) {
			albumId = albumIdArray[i];
			
			albumTitle = response[albumId].name;
			
			if(albumTitle.length>famax_global_options.maxAlbumNameLength) {
				albumTitleShort = albumTitle.substring(0,famax_global_options.maxAlbumNameLength) + "..";
			} else {
				albumTitleShort = albumTitle;
			}
			
			$famaxTabs.append('<span id="photos_'+albumId+'" class="famax-tab" >'+albumTitleShort+'</span>');
			$famaxSelect.append('<option value="photos_'+albumId+'" >'+albumTitle+'</option>');
		}
		
		//click the selectedTab
		if(famax_global_options.selectedTab.charAt(0)=='a') {
			albumSelect = (famax_global_options.selectedTab.charAt(1)) - 1;
			if(null!=albumIdArray[albumSelect]) {
				$('#photos_'+albumIdArray[albumSelect]).click();
			}
		}
	},
	
	displayTabFeeds = function(tabId, $famaxContainer) {
	
		//console.log('displayTabFeeds tabId-'+tabId);
		var tab_split = tabId.split('_');

		//showLoader($famaxContainer);
		action = tab_split[0];
		if(action.indexOf("posts")!=-1) {
			getPagePosts($famaxContainer,null);
		}else if (action.indexOf("tagged")!=-1) {
			getPageTags($famaxContainer,null);
		} else if(action.indexOf("feed")!=-1) {
			//TODO: Groups will be added in 5.0
			//getGroupFeeds(tab_split[0],tab_split[1],$famaxContainer,null);
		} else if(action.indexOf("photos")!=-1) {
			getAlbumPhotos(tab_split[1],$famaxContainer,null);
		} else if(action.indexOf("videos")!=-1) {
			getPageVideos($famaxContainer,null);
		} else if(action.indexOf("albums")!=-1) {
			getPageAlbums($famaxContainer,null);
		} else if(action.indexOf("pstream")!=-1) {
			getPagePhotos($famaxContainer,null);
		}
		
		//$famaxContainer.find('.famax-tab').removeClass('famax-tab-hover');	
		//$('#'+tabId).addClass('famax-tab-hover');
		//$famaxContainer.find('#famax-select').val(tabId);

	};



	//famax plugin definition
    $.fn.famax = function(options) {
		
		var famax_global_options = {};
		var $famaxContainer = this;
		var albumIdArray = [];
		
		//add fontawesome icons
		if (document.createStyleSheet){
			document.createStyleSheet("http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css");
		} else {
			$("head").append("<link rel='stylesheet' href='http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css' type='text/css' />");
		}
		
		//Get CSS for Skins
		if(options.skin=="white" || options.skin=="grey" || options.skin=="black") {
			if (document.createStyleSheet){
                document.createStyleSheet("./css/famax_"+options.skin+".min.css");
            } else {
                $("head").append("<link rel='stylesheet' href='./css/famax_"+options.skin+".min.css' type='text/css' />");
            }
		} else {
			//don't load any styles
			//user will load them manually
		}
		
		//set local options		
		famax_global_options.maxResults = options.maxResults||12;
		famax_global_options.innerOffset = options.innerOffset||40;
		famax_global_options.outerOffset = options.outerOffset||35;
		famax_global_options.minItemWidth = options.minItemWidth||300;
		famax_global_options.maxItemWidth = options.maxItemWidth||450;
		//famax_global_options.aspectRatio = 360/640;		
		famax_global_options.alwaysUseDropdown = options.alwaysUseDropdown;
		famax_global_options.notFoundImage = options.notFoundImage||"";
		
		//3.0 added options
		famax_global_options.maxAttachments = options.maxAttachments||3;
		famax_global_options.maxAlbumNameLength = 22;
		famax_global_options.selectedTab = options.selectedTab||"p";
		famax_global_options.maxItemsDisplayed = options.maxItemsDisplayed||25;
		
		//4.0 added options
		famax_global_options.displayMetricsForTags = options.displayMetricsForTags||false;
		famax_global_options.displayMetricsForPosts = options.displayMetricsForPosts;
		if(null==famax_global_options.displayMetricsForPosts) famax_global_options.displayMetricsForPosts=true;
		famax_global_options.maxComments = options.maxComments||14;
		famax_global_options.onClickAction = options.onClickAction||"popup";
		famax_global_options.refreshTimeout = options.refreshTimeout||1000;

		//famax_global_options.maxPlaylistNameLength = 22;
		
		if(options.fanPage!=null) {
			s=options.fanPage.lastIndexOf("/");
			//console.log('s-'+s);
			if(s!=-1) {
				fanPageId = options.fanPage.substring(s+1);
				famax_global_options.fanPageId=fanPageId;
			} else {
				//Fan page URL incorrect
				famax_global_options.fanPageId=null;
			}
			
			/* Groups will be added in 5.0
			if(options.fanPage.indexOf("groups/")!=-1) {
				famax_global_options.type="group";
			} else {
				famax_global_options.type="page";
			}
			//console.log("Type - "+famax_global_options.type);*/
		}
		
		
		options.maxContainerWidth = options.maxContainerWidth||1000;
		$famaxContainer.css('max-width',(options.maxContainerWidth)+'px');
		

		if(options.maxContainerWidth<500) {
			$("body").append("<style>#famax-stat-holder {display:none;}.famax-subscribe {display:none;}.famax-tab {width: 42%;text-align: center;}</style>");
		}

		if(options.maxContainerWidth<300) {
			$("body").append("<style>.famax-tab {width: 90%;text-align: center;}</style>");
		}
		
		
		//get album details
		if($.isArray(options.album)) {
			for(var i=0; i<options.album.length; i++) {
				s=options.album[i].indexOf("?set=a.");
				//console.log('s-'+s);
				if(s!=-1) {
					e = options.album[i].indexOf(".",s+7);
					albumId = options.album[i].substring(s+7,e);
					//console.log('playlistId-'+playlistId);
					albumIdArray.push(albumId);
				} else {
					//alert("Could Not Find Album..");
				}
			}
		}
		
		famax_global_options.albumIdArray = albumIdArray;

		//attach global options
		$famaxContainer.data('famax_global_options',famax_global_options);

		//get access Token and then display feeds..
		getAccessToken(options,$famaxContainer);
		
		//Facebook Login script
		$.getScript( "http://connect.facebook.net/en_US/sdk.js" )
		.done(function( script, textStatus ) {
			//console.log("Facebook Init called..");
			FB.init({
				appId      : options.appId,
				cookie     : true, 
				xfbml      : false, 
				version    : 'v2.4'
			});
		})
		.fail(function( jqxhr, settings, exception ) {
			//console.log("Facebook Init failed..");
		});
		
		//return this for chaining
		return this;
 
    };
	
 
}( jQuery ));
