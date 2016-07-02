Rails.application.routes.draw do
  
  resources :armies
  resources :fights
  devise_for :users, :controllers => { registrations: 'registrations' }

  root 'home#index'

  get 'home' => 'home#index'
  get 'simulator' => 'home#armyfight'
  get 'tutorial' => 'home#tutorial'
  get 'events' => 'home#events'
  post 'destroy_armies' => 'fights#destroy_armies'
  get 'all_fights' => 'fights#all_fights'
  get "play/:id" => 'fights#play'
  post 'watched_fight' => 'fights#watched_fight'

end
