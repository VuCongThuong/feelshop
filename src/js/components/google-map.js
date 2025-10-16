import $ from 'jquery';
import { Loader } from "@googlemaps/js-api-loader";

$(function () {
    const loader = new Loader({
        apiKey: "AIzaSyCj96I5xviUm8X89K-Rag-Y1hjhGj2WgKA",
        version: "weekly"
    });

    loader.load().then(async () => {
        const { Map } = await google.maps.importLibrary("maps");

        $('[data-single-map]').each(function(index, ele) {
            var storeData = $(ele).data('stores');
            storeData = storeData.filter(function(store) {
                return (store.lat != null && store.lng != null);
            });

            var map = new google.maps.Map(ele, {
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: { lat: 10.799453, lng: 106.683586 },
                styles: [
                    {
                        featureType: "water",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#d3d3d3"
                        }]
                    }, {
                        featureType: "transit",
                        stylers: [{
                            color: "#808080"
                        }, {
                            visibility: "off"
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "geometry.stroke",
                        stylers: [{
                            visibility: "on"
                        }, {
                            color: "#b3b3b3"
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#ffffff"
                        }]
                    }, {
                        featureType: "road.local",
                        elementType: "geometry.fill",
                        stylers: [{
                            visibility: "on"
                        }, {
                            color: "#ffffff"
                        }, {
                            weight: 1.8
                        }]
                    }, {
                        featureType: "road.local",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#d7d7d7"
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "geometry.fill",
                        stylers: [{
                            visibility: "on"
                        }, {
                            color: "#ebebeb"
                        }]
                    }, {
                        featureType: "administrative",
                        elementType: "geometry",
                        stylers: [{
                            color: "#a7a7a7"
                        }]
                    }, {
                        featureType: "road.arterial",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#ffffff"
                        }]
                    }, {
                        featureType: "road.arterial",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#ffffff"
                        }]
                    }, {
                        featureType: "landscape",
                        elementType: "geometry.fill",
                        stylers: [{
                            visibility: "on"
                        }, {
                            color: "#efefef"
                        }]
                    }, {
                        featureType: "road",
                        elementType: "labels.text.fill",
                        stylers: [{
                            color: "#696969"
                        }]
                    }, {
                        featureType: "administrative",
                        elementType: "labels.text.fill",
                        stylers: [{
                            visibility: "on"
                        }, {
                            color: "#737373"
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "labels.icon",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        featureType: "road.arterial",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#d6d6d6"
                        }]
                    }, {
                        featureType: "road",
                        elementType: "labels.icon",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {}, {
                        featureType: "poi",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#dadada"
                        }]
                    }
                ]
            });

            map.maxDefaultZoom = 8;

            google.maps.event.addListenerOnce(map, "bounds_changed", function () {
                this.setZoom(Math.min(this.getZoom(), this.maxDefaultZoom));
                console.log(this.getZoom());
            });

            var markers = [];

            var citySelect = $('#city-select');
            var cityOptions = ['all'];
            var selectedCity = 'all';

            var districtSelect = $('#district-select');
            var districtOptions = ['all'];

            var tampStore = [];
            var currentInfoWindow;

            for (var i = 0; i < storeData.length; i++) {
                (function() {
                    var store = storeData[i];
                    if(store.lat == null || store.lng == null) return;
                    var position = new google.maps.LatLng(store.lat, store.lng);
                    var marker = new google.maps.Marker({
                        position: position,
                        map: map
                    });

                    var infoWindow = new google.maps.InfoWindow({
                        content: store.name
                    });

                    marker.addListener('click', function() {
                        map.maxDefaultZoom = 15;
                        map.setZoom(12);

                        if (currentInfoWindow) {
                            currentInfoWindow.close();
                        }

                        map.panTo(this.getPosition());
                        infoWindow.open(map, marker);
                        currentInfoWindow = infoWindow;

                        $('[data-store-list-item]').removeClass('active');
                        $('[data-store-list-item][data-store-id="' + store.id + '"]').addClass('active');
                    });

                    var formattedCityName = '';
                    storeData.forEach(function(store) {
                        formattedCityName = store.city_name.replace(/\s+/g, "_");
                        formattedCityName = formattedCityName.toLowerCase();

                        if (!cityOptions.includes(formattedCityName)) {
                            cityOptions.push(formattedCityName);
                            var option = $('<option></option>');
                            option.attr('value', formattedCityName);
                            option.text(store.city_name);
                            citySelect.append(option);
                        }
                    });

                    var storeListItem = $('<div class="flex gap-[8px] md:gap-[12px] lg:gap-[16px] border-b border-[#D1D5DB] py-[16px] hover:bg-[#F3F4F6] transition-colors duration-300 md:px-[22px]" data-store-list-item data-store-id=' + store.id + '>' +
                            '<span class="icon-pin-op2 text-[#FF8000] text-[20px] lg:text-[30px] w-[24px] h-[24px] lg:w-[36px] lg:h-[36px]"></span>' +
                            '<div class="flex-1 flex flex-col gap-[8px]">' +
                            '<span class="uppercase font-bold">' + store.name + '</span>' +
                            '<span class="text-[#4B5563]">' + store.address + '</span>' +
                            '<a href="tel:' + store.phone.replace(/ /g, "") + '" class="hidden md:flex items-center gap-[8px]">' +
                            '<span class="icon-phone-op2 text-[16px] w-[20px] h-[20px] text-[#FF8000]"></span>' +
                            '<span class="txt text-[#374151]">' + store.phone + '</span>' +
                            '</a>' +
                            '<a href="#" class="hidden md:flex items-center gap-[8px] text-[#FF8000]" data-popup-element data-name="' + store.id + '">' +
                            '<span class="icon-eye text-[12px] w-[20px] h-[20px]"></span>' +
                            '<span class="txt font-semibold">View more</span>' +
                            '</a>' +
                            '</div>' +
                            '</div>')

                        .on('click', function() {
                            map.maxDefaultZoom = 15;
                            map.setZoom(12);
                            
                            if (currentInfoWindow) {
                                currentInfoWindow.close();
                            }

                            $('[data-store-list-item]').removeClass('active');
                            $(this).addClass('active');
                            
                            map.panTo(marker.getPosition());
                            infoWindow.open(map, marker);
                            currentInfoWindow = infoWindow;
                        });

                    $('[data-store-list]').append(storeListItem);
                    markers.push(marker);
                })();
            }

            var bounds = new google.maps.LatLngBounds();
            markers.forEach(function(marker) {
                bounds.extend(marker.getPosition());
            });

            map.fitBounds(bounds);

            $('[data-locations-count]').text(storeData.length);

            var formattedCityName = '';
            $('#city-select').on('change', function() {
                selectedCity = $(this).val();
                var filteredStores = storeData;
                tampStore = storeData;
                if (selectedCity !== 'all') {
                    filteredStores = storeData.filter(function(store) {
                        formattedCityName = store.city_name.replace(/\s+/g, "_");
                        formattedCityName = formattedCityName.toLowerCase();
                        return formattedCityName === selectedCity;
                    });

                    tampStore = filteredStores;

                    updateDistrictOptions(filteredStores);

                } else if (selectedCity == 'all') {
                    var districtSelect = $('#district-select');
                    districtSelect.empty();
                    districtSelect.append('<option value="all">Chọn quận huyện</option>');
                }

                
                filterStoresByDistrict(filteredStores, 'all');
            });

            $('#district-select').on('change', function() {
                var selectedDistrict = $(this).val();
                filterStoresByDistrict(tampStore, selectedDistrict);
            });

            $('[data-map-main]').removeClass('loading');

            function updateDistrictOptions(stores) {
                var districtSelect = $('#district-select');
                districtSelect.empty();
                districtSelect.append('<option value="all">Chọn quận huyện</option>');

                var formattedDistrictName = '';
                districtOptions = ['all'];
                
                stores.forEach(function(store) {
                    formattedDistrictName = store.district_name.replace(/\s+/g, "_");
                    formattedDistrictName = formattedDistrictName.toLowerCase();
                    
                    if (!districtOptions.includes(formattedDistrictName)) {
                        districtOptions.push(formattedDistrictName);
                        var option = $('<option></option>');
                        option.attr('value', formattedDistrictName);
                        option.text(store.district_name);
                        districtSelect.append(option);
                    }
                });
            }

            function filterStoresByDistrict(stores, selectedDistrict) {
                var filteredStores = stores;
                if (selectedDistrict !== 'all') {
                    filteredStores = stores.filter(function(store) {
                        var formattedDistrictName = '';
                        formattedDistrictName = store.district_name.replace(/\s+/g, "_");
                        formattedDistrictName = formattedDistrictName.toLowerCase();
                        return formattedDistrictName === selectedDistrict;
                    });
                }

                markers = [];

                $('[data-store-list]').empty();
                var currentInfoWindow;

                filteredStores.forEach(function(store) {
                    var position = new google.maps.LatLng(store.lat, store.lng);
                    var marker = new google.maps.Marker({
                        position: position,
                        map: map
                    });

                    var infoWindow = new google.maps.InfoWindow({
                        content: store.name
                    });

                    marker.addListener('click', function() {
                        if (currentInfoWindow) {
                            currentInfoWindow.close();
                        }

                        map.panTo(this.getPosition());
                        infoWindow.open(map, marker);
                        currentInfoWindow = infoWindow;

                        $('[data-store-list-item]').removeClass('active');
                        $('[data-store-list-item][data-store-id="' + store.id + '"]').addClass('active');
                    });

                    markers.push(marker);

                    var storeListItem = $('<div class="flex gap-[8px] md:gap-[12px] lg:gap-[16px] border-b border-[#D1D5DB] py-[16px] hover:bg-[#F3F4F6] transition-colors duration-300 md:px-[22px]" data-store-list-item data-store-id=' + store.id + '>' +
                        '<span class="icon-pin-op2 text-[#FF8000] text-[20px] lg:text-[30px] w-[24px] h-[24px] lg:w-[36px] lg:h-[36px]"></span>' +
                        '<div class="flex-1 flex flex-col gap-[8px]">' +
                        '<span class="uppercase font-bold">' + store.name + '</span>' +
                        '<span class="text-[#4B5563]">' + store.address + '</span>' +
                        '<a href="tel:' + store.phone.replace(/ /g, "") + '" class="hidden md:flex items-center gap-[8px]">' +
                        '<span class="icon-phone-op2 text-[16px] w-[20px] h-[20px] text-[#FF8000]"></span>' +
                        '<span class="txt text-[#374151]">' + store.phone + '</span>' +
                        '</a>' +
                        '<a href="#" class="hidden md:flex items-center gap-[8px] text-[#FF8000]" data-popup-element data-name="' + store.id + '">' +
                        '<span class="icon-eye text-[12px] w-[20px] h-[20px]"></span>' +
                        '<span class="txt font-semibold">View more</span>' +
                        '</a>' +
                        '</div>' +
                        '</div>')
                        .on('click', function() {
                            if (currentInfoWindow) {
                                currentInfoWindow.close();
                            }

                            $('[data-store-list-item]').removeClass('active');
                            $(this).addClass('active');

                            map.panTo(marker.getPosition());
                            infoWindow.open(map, marker);
                            currentInfoWindow = infoWindow;
                        });

                    $('[data-store-list]').append(storeListItem);
                });

                $('[data-locations-count]').text(filteredStores.length);

                var bounds = new google.maps.LatLngBounds();
                markers.forEach(function(marker) {
                    bounds.extend(marker.getPosition());
                });
                map.fitBounds(bounds);
            }
        });
    });
});