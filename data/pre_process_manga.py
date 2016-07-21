from astropy.io import fits
import numpy as np
import sys

hdulist = fits.open(sys.argv[1])

for hdu in hdulist:
    if hdu.header['BITPIX'] == -64:
        hdu.data = hdu.data.astype(np.float32)
    elif hdu.header['BITPIX'] == 64:
        hdu.data = hdu.data.astype(np.int32)

hdulist.writeto('{0}_float32.fits'.format(sys.argv[1].split('.')[0]))
