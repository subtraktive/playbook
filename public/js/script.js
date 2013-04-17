$(function(){

	window.Category = Backbone.Model.extend({
		
		idAttribute: "_id",

		urlRoot: "/categories",

		// defaults: {
		// 	name: '',
		// 	img: '../img/default.png',
		// 	list: []
		// },

		initialize: function(){
			console.log("the model has been initialized")
		},

		//localStorage: new Backbone.LocalStorage('category')
	});

	// window.Item = Backbone.Model.extend({
	// 	idAttribute: '_iid',

	// 	initialize: function(){
	// 		console.log("model initialized")
	// 	}
	// });

	window.CategoryList = Backbone.Collection.extend({
		
		model: Category,

		url: "/categories"

		//url: '/api/categories'
	});

	//window.Category = new CategoryList();

	window.AppRouter = Backbone.Router.extend({

		routes: {
			"categories" : "list",
			"categories/:id" : "showDetails"
		},

		initialize: function(){
			console.log("the router is initiazed");     
		},

		list: function(){
			console.log("the category will be listed");
			var categoryList = new CategoryList();
			categoryList.fetch({success: function(collection, response, options){
				new AppView({collection: categoryList});
			}})
		},

		showDetails: function(id){
			var category = new Category({_id: id});
			category.fetch({success: function(){
				$('.playbook-wrapper').html(new CategoryDetailView({model: category}).el);
			}})
		}
	})

	window.CategoryDetailView = Backbone.View.extend({

		initialize: function(){
			this.render();
		},

		render: function(){
			var source = document.getElementById('category-detail').innerHTML,
				template = Handlebars.compile(source);
			this.el.innerHTML = template(this.model.toJSON());
			return this;
		}
	});


	window.CategoryView = Backbone.View.extend({

		tagName: 'li',

		initialize: function(){
			//this.render();
		},

		render: function(){
			var source = document.getElementById('category-view').innerHTML,
				template = Handlebars.compile(source);
			this.el.innerHTML = template(this.model.toJSON());
			return this;
		}
	});

	window.AppView = Backbone.View.extend({

		el: '.playbook-wrapper',

		initialize: function(){
			console.log("the appview is initialize");
			_.bindAll(this, 'addOne', 'addAll');
			this.addAll();
			//this.collection.bind('add', this.addOne);
			//this.collection.bind('reset', this.addAll);
			//Category.fetch();
		},

		events: {
			'click #add-new' : 'addNew',
			'click .cancel-add': 'cancelAdd',
			'click .submit-add': 'submitAdd',
			'click .category-name': 'showList',
		},

		addNew: function(e){
			e.preventDefault(); 	
			var source = document.getElementById('add-category').innerHTML,
				template =  Handlebars.compile(source),
				sel = this.el.getElementsByClassName('input-holder')[0];
			sel.innerHTML = template();
		},

		cancelAdd: function(e){
			e.preventDefault();
			var sel = this.el.getElementsByClassName('input-holder')[0];
			sel.innerHTML = "";
		},

		submitAdd: function(e){
			e.preventDefault();
			var sel = this.el.getElementsByClassName('input-holder')[0],
			category = this.el.getElementsByClassName('add-category')[0].value;
			Category.create({name: category});
			sel.innerHTML = '';
		},

		addOne: function(category){
			var view = new CategoryView({model: category}),
			selector = this.el.getElementsByClassName('category-list')[0];
			selector.appendChild(view.render().el);
			//selector.innerHTML = '';
		},

		addAll: function(){
			this.collection.each(this.addOne);
		},

		showList: function(){
			this.el.innerHTML = '';

		}
	});

	window.App = new AppRouter();
	Backbone.history.start();
});	