# This file will get the images from teh website IGCD

from bs4 import BeautifulSoup
from requests import get as rget
from time import sleep
from tqdm import tqdm


def get_all_car_links():
    """This function gets the links from the car "hub" and returns the list of URLs

    Returns:
        list: the list of full urls (example: https://www.igcd.net/vehicle.php?id=18930)
    """
    url = 'https://www.igcd.net/game.php?id=20072012'
    response = rget(url)

    soup = BeautifulSoup(response.text, 'html.parser')

    list_of_URLs = []
    for link in soup.find_all('a'):
        link = link.get('href')
        # if it's a car, then add it to the list
        if (link.startswith('vehicle.php')):
            list_of_URLs.append('https://www.igcd.net/'+link)

    return list_of_URLs


def get_image_from_url_and_save(url):
    response = rget(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    image_link = 'https://www.igcd.net/' + \
        soup.findAll(attrs={'class': 'VehiclePicture'})[0].get('src')
    img_data = rget(image_link).content
    with open('images/'+image_link.split('/')[-1], 'wb') as handler:
        handler.write(img_data)


cars_urls = get_all_car_links()

for link in tqdm(cars_urls):
    sleep(1)
    get_image_from_url_and_save(link)
