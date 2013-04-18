$(function(){

	window.Category = Backbone.Model.extend({
		
		idAttribute: "_id",

		urlRoot: "/categories",

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

		url: "/categories",

		initialize: function(){
			console.log("the collection is initialized")
		}

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
			var category = new Category({_id: id}),
				categoryList = new CategoryList(),
				selector = document.getElementById('playbook-contents');
			$('#playbook-contents').html('');
			categoryList.fetch({success: function(){
				$('#playbook-contents').append(new CategorySelectorView({collection: categoryList}).el);
				category.fetch({success: function(){
					$('#playbook-contents').append( new CategoryDetailView({model: category}).el);
				}});
			}})
			
		}
	})

	window.CategorySelectorView = Backbone.View.extend({
		
		className: 'selector-wrapper clearfix',

		initialize: function(){
			this.render();
			console.log("catsel view init")
		},

		events: {
			'change .select-category' : 'showCategoryList',
			'click .random-selector' : 'showRandomList'
		},

		render: function(){
			var source = document.getElementById('category-selector').innerHTML,
				template = Handlebars.compile(source),
				categories = this.collection.toJSON(),
				cat =[];
			for(var i=0; i<categories.length; i++){
				cat.push({name: categories[i].name, id: categories[i]._id});
			}
			var catJSON = {categories: cat};
			this.el.innerHTML = template(catJSON);
			return this;
		},

		showCategoryList: function(){
			var categoryId = document.getElementsByClassName('select-category')[0].value,
			category = this.collection.get(categoryId);
			//console.log("the sleected cat is " +category);
			category.fetch({success: function(){
				//selector.innerHTML = new CategoryDetailView({model: category}).el;
				$('.selected-category-detail').html( new CategoryDetailView({model: category}).el.innerHTML);
			}})
		},

		showRandomList: function(){
			
		}
	});

	window.CategoryDetailView = Backbone.View.extend({

		className: 'selected-category-detail clearfix',

		initialize: function(){
			this.render();
			console.log("catdetsel view init")

		},

		render: function(){
			var source = document.getElementById('category-item-contents').innerHTML,
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
			this.render();
			this.addAll();
			//this.collection.bind('add', this.addOne);
			//this.collection.bind('reset', this.addAll);
			//Category.fetch();
		},

		render: function(){
			var source = document.getElementById('category-list-contents').innerHTML,
				destination = document.getElementById('playbook-contents'),
				template = Handlebars.compile(source);
			destination.innerHTML = template();
		},

		events: {
			// 'click #add-new' : 'addNew',
			// 'click .cancel-add': 'cancelAdd',
			// 'click .submit-add': 'submitAdd',
			'click .category-name': 'showList',
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
		// addNew: function(e){
		// 	e.preventDefault(); 	
		// 	var source = document.getElementById('add-category').innerHTML,
		// 		template =  Handlebars.compile(source),
		// 		sel = this.el.getElementsByClassName('input-holder')[0];
		// 	sel.innerHTML = template();
		// },

		// cancelAdd: function(e){
		// 	e.preventDefault();
		// 	var sel = this.el.getElementsByClassName('input-holder')[0];
		// 	sel.innerHTML = "";
		// },

		// submitAdd: function(e){
		// 	e.preventDefault();
		// 	var sel = this.el.getElementsByClassName('input-holder')[0],
		// 	category = this.el.getElementsByClassName('add-category')[0].value;
		// 	Category.create({name: category});
		// 	sel.innerHTML = '';
		// },

		
	});

	window.App = new AppRouter();
	Backbone.history.start();
});	