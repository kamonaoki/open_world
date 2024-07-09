class PostsController < ApplicationController
  before_action :authenticate_user!


  def index
    @posts = Post.includes(:user)
    @post = Post.new
    respond_to do |format|
      format.html 
      format.json { render json: @posts.map { |post| post.as_json.merge(image_url: url_for(post.image),user_name: post.user.name,
      user_path: user_path(post.user)) } } # JSON形式でのレスポンスを返す
    end
  end

  def new
    @post = Post.new
  end

  def create
    @post = Post.new(post_params) # 投稿パラメータを使用して新しい投稿オブジェクトを作成
    if @post.save
      # 画像がアップロードされている場合、それを添付する
      if params[:post][:image].present?
        @post.image.attach(params[:post][:image])
      end
      # 成功した場合、JSON形式でステータスと投稿情報、リダイレクトURLを返す
      render json: { status: 'success', post: @post, redirect_url: posts_path }
    else
      # 失敗した場合、JSON形式でエラーメッセージを返す
      render json: { status: 'error', errors: @post.errors.full_messages }
    end
  end

  def edit
    @post = Post.find(params[:id])
  end
  
  def update
    @post = Post.find(params[:id])
    if @post.update(post_params)
      # 画像がアップロードされている場合、それを添付する
      if params[:post][:image].present?
        @post.image.attach(params[:post][:image])
      end
      redirect_to user_path(current_user), notice: 'Post was successfully updated.'
    else
      render :edit
    end
  end

  def latest
    # 現在のユーザー以外の最新の投稿を取得
    @latest_posts = Post.where.not(user_id: current_user.id).order(created_at: :desc).limit(10)
    
    # JSONに画像のURLを含める
    render json: @latest_posts.map { |post| 
      post_data = {
        id: post.id,
        title: post.title,
        description: post.description,
        latitude: post.latitude,
        longitude: post.longitude,
        user_name: post.user.name,
        user_path: user_path(post.user)

      }
      post_data[:image_url] = url_for(post.image) if post.image.attached?
      post_data
    }
  end


  private

  def post_params
    params.require(:post).permit(:title, :description, :latitude, :longitude, :image).merge(user_id: current_user.id)
  end
end
