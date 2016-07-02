Rails.application.routes.draw do
  
  devise_for :users, :controllers => { registrations: 'registrations' }

  scope ":locale", locale: /#{I18n.config.available_locales.join("|")}/ do

    resources :armies
    resources :fights

    ## LAYOUT LINKS
    root 'home#index'
    get 'home' => 'home#index'
    get 'simulator' => 'home#armyfight'
    get 'about' => 'home#about'
    get 'translations' => 'translations#index'

    ## AJAX FOR ARMIES
    post 'destroy_armies' => 'fights#destroy_armies'
    get 'all_fights' => 'fights#all_fights'
    get "play/:id" => 'fights#play'
    post 'watched_fight' => 'fights#watched_fight'

    ## AJAX FOR TRNALSATIONS
    post 'delete_key' => 'translations#delete_key'
    post 'change_value' => 'translations#change_value'
    post 'add_language' => 'translations#add_language'
    post 'delete_locale' => 'translations#delete_locale'

  end
  get '*path', to: redirect("/#{(I18n.locale)}/%{path}"), constraints: lambda { |req| !req.path.starts_with? "/#{I18n.locale}/" }
  match '', to: redirect("/#{(I18n.locale)}"), via: [:get, :post, :put, :delete]
  
end
