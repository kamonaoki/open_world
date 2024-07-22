Rails.application.routes.draw do
  devise_for :users
  resources :posts do
    resources :comments, only: :create
  end
  root 'posts#index'
  resources :users, only: :show
  get 'latest_posts', to: 'posts#latest'
end
