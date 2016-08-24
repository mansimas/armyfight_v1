class TranslationsController < ApplicationController
    require 'will_paginate/array'
    def index
        @translations = ($redis.hkeys 'en').paginate(:page => params[:page], :per_page => 20)
    end

    def change_value
        $redis.hset params[:lang], params[:key], params[:value]
        render :json => { :status => :ok }
    end

    def delete_key
        ($redis.hkeys 'languages').each do |lang|
            $redis.hdel lang, params[:key]
        end
        render :json => { :status => :ok }
    end

    def add_locale
        $redis.hset 'languages', params[:lang], ''
        I18n.config.available_locales = $redis.hkeys 'languages'
        Rails.application.reload_routes!
        render :json => { :status => :ok }
    end

    def delete_locale
        $redis.hdel 'languages', params[:loc]
        $redis.del params[:loc]
        render :json => { :status => :ok }
    end

    def get_keylist
        if params[:lastkey] == 'all'
            keylist = []
            keyvals = []
            navigations = []
        else
            keylist = $redis.hkeys params[:firstkey] + '.' + params[:lastkey]
            keyvals = []
            navigations = []
            keylist.each do |k|
                if ($redis.hget params[:firstkey] + '.' + params[:lastkey], k) == 'executableitem'
                    val = (params[:firstkey] + '.' + params[:lastkey] + '.' + k).sub!("navigation.", "")
                    keyvals << [val, ($redis.hget I18n.locale, val)]
                else
                    val = (params[:firstkey] + '.' + params[:lastkey] + '.' + k)
                    navigations << [val, k]
                end
            end
        end
        render :json => { :status => :ok, :keylist => keylist.as_json, :keyvals => keyvals.as_json, :navigations => navigations.as_json }
    end
 end