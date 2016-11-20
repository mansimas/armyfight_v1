class FightsController < ApplicationController
  before_action :set_fight, only: [:show, :edit, :update, :destroy]
  skip_before_filter :authenticate_user!, :except => [:index, :new, :edit, :destroy, :edit_fight]

  def index
    @fights = Fight.where(:user_id => current_user.id).order(updated_at: :desc).paginate(:page => params[:page], :per_page => 30)
  end

  def all_fights
    @fights = Fight.all.order(updated_at: :desc).paginate(:page => params[:page], :per_page => 30)
  end

  def show
    @fight = Fight.find_by_id(params[:id])
    targets = []
    @fight.armies.each do |a|
      a.targets.each do |t|
        targets.push([t.id, t.army_id, t.x, t.y, t.stay_time])
      end
    end
    render :json => { 
      :status => :ok, 
      :fight => @fight.armies.as_json, 
      :targets => targets.as_json, 
      :map_elements => @fight.map_elements.as_json, 
      :name => @fight.name 
    } 
  end

  def show_fight
    @fight = Fight.find(params[:id])
  end

  def edit_fight
    @fight = Fight.find(params[:id])
    if (@fight.user_id != current_user.id) && (current_user.nickname != 'mansim')
      redirect_to root_path
    end
  end

  def add_map_elements
    params[:items].each do |item|
      map_element = MapElement.new
      map_element.fight_id = params[:fight_id]
      map_element.color = item[0]
      map_element.shape = item[1]
      map_element.elements = item[2]
      map_element.save!
    end

    render :json => { :status => :ok, :message => 'ok' }
  end

  def update_fight
    @fight = Fight.find(params[:fight][:id])
    @fight.description = params[:fight][:description]
    @fight.name = params[:fight][:name]
    @fight.save
    redirect_to edit_fight_path(id: @fight.id)
  end

  def create_fight
    @fight = Fight.new
    @fight.user_id = current_user.id
    @fight.description = params[:fight][:description]
    @fight.name = params[:fight][:name]
    @fight.save
    redirect_to edit_fight_path(id: @fight.id)
  end

  def new
  end

  def play
    @fight = Fight.find_by_id(params[:id])
    if !@fight
      redirect_to root_path
    end
  end

  def watched_fight
    ActiveRecord::Base.record_timestamps = false
    begin
      @fight = Fight.find_by(id: params[:id])
      @fight.watched = @fight.watched.to_i + 1
      @fight.save
    ensure
      ActiveRecord::Base.record_timestamps = true
    end
    render :json => { :status => :ok, :fight => @fight.id }
  end

  def edit
    if (@fight.user_id != current_user.id) && (current_user.nickname != 'mansim')
      redirect_to root_path
    end
  end

  def create
    @fight = Fight.create!(:name => params[:fight_name], :user_id => current_user.id)
    render :json => { :status => :ok, :fight => @fight.id }
  end

  def update
    @fight.name = params[:fight_name]
    if (@fight.user_id != current_user.id) && (current_user.nickname != 'mansim')
      redirect_to root_path
    end
    @fight.save!
    render :json => { :status => :ok, :fight => @fight.id }
  end

  def destroy_armies
    fight = Fight.find_by(id: params[:fight_id])
    fight.armies.destroy_all
    render :json => { :status => :ok, :message => 'destroyed' }
  end

  def destroy
    @fight.destroy
    if (@fight.user_id != current_user.id) && (current_user.nickname != 'mansim')
      redirect_to root_path
    end
    respond_to do |format|
      format.html { redirect_to fights_url }
      format.json { head :no_content }
    end
  end

  private
    def set_fight
      @fight = Fight.find_by(id: params[:id])
    end

    def fight_params
      params.require(:fight).permit(:name, :user_id, :watched)
    end
end
